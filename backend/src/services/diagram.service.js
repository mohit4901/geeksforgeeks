import { extractResources } from "./terraform.service.js";

function labelize(name = "") {
  return name
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function node(id, label) {
  return `${id}["${label}"]`;
}

export function buildDiagram(terraformCode = "") {
  const resources = extractResources(terraformCode);

  if (!resources || !resources.length) {
    return `flowchart LR
A["No Resources Found"]`;
  }

  const lines = ["flowchart LR"];
  const addedNodes = new Set();
  const addedEdges = new Set();

  const vpcs = resources.filter((r) => r.type.includes("vpc"));
  const subnets = resources.filter((r) => r.type.includes("subnet"));
  const igws = resources.filter((r) => r.type.includes("internet_gateway"));
  const routeTables = resources.filter((r) => r.type.includes("route_table"));
  const natGateways = resources.filter((r) => r.type.includes("nat_gateway"));
  const securityGroups = resources.filter((r) => r.type.includes("security_group"));
  const ec2s = resources.filter(
    (r) => r.type.includes("instance") || r.type.includes("ec2")
  );
  const s3s = resources.filter((r) => r.type.includes("s3_bucket"));
  const outputs = resources.filter((r) => r.type.includes("output"));

  function addNode(id, label) {
    if (!addedNodes.has(id)) {
      lines.push(node(id, label));
      addedNodes.add(id);
    }
  }

  function addEdge(from, to) {
    const key = `${from}->${to}`;
    if (!addedEdges.has(key)) {
      lines.push(`${from} --> ${to}`);
      addedEdges.add(key);
    }
  }

  // Root
  addNode("USER", "Cloud Architecture");

  // VPCs
  vpcs.forEach((vpc, i) => {
    const vpcId = `VPC${i}`;
    addNode(vpcId, `VPC\n${labelize(vpc.name)}`);
    addEdge("USER", vpcId);

    // Subnets under VPC
    subnets.forEach((subnet, j) => {
      const subnetId = `SUBNET${j}`;
      const isPrivate =
        subnet.name.toLowerCase().includes("private") ||
        subnet.body.includes("private");

      addNode(
        subnetId,
        `${isPrivate ? "Private" : "Public"} Subnet\n${labelize(subnet.name)}`
      );
      addEdge(vpcId, subnetId);

      // Route tables
      routeTables.forEach((rt, k) => {
        const rtId = `RT${k}`;
        addNode(rtId, `Route Table\n${labelize(rt.name)}`);
        addEdge(subnetId, rtId);
      });

      // NAT Gateway
      natGateways.forEach((nat, n) => {
        const natId = `NAT${n}`;
        addNode(natId, `NAT Gateway\n${labelize(nat.name)}`);
        addEdge(subnetId, natId);
      });

      // EC2 under subnet
      ec2s.forEach((ec2, e) => {
        const ec2Id = `EC2${e}`;
        addNode(ec2Id, `EC2 Instance\n${labelize(ec2.name)}`);
        addEdge(subnetId, ec2Id);

        // Security groups to EC2
        securityGroups.forEach((sg, s) => {
          const sgId = `SG${s}`;
          addNode(sgId, `Security Group\n${labelize(sg.name)}`);
          addEdge(sgId, ec2Id);
        });

        // EC2 to S3
        s3s.forEach((bucket, b) => {
          const s3Id = `S3${b}`;
          addNode(s3Id, `S3 Bucket\n${labelize(bucket.name)}`);
          addEdge(ec2Id, s3Id);
        });
      });
    });

    // Internet Gateway
    igws.forEach((igw, g) => {
      const igwId = `IGW${g}`;
      addNode(igwId, `Internet Gateway\n${labelize(igw.name)}`);
      addEdge(vpcId, igwId);
    });
  });

  // Fallback for standalone resources
  if (!vpcs.length) {
    resources.forEach((r, index) => {
      const id = `R${index}`;
      addNode(id, `${r.type}\n${labelize(r.name)}`);
      addEdge("USER", id);
    });
  }

  // Styling
  lines.push(`
classDef root fill:#111827,stroke:#6366f1,stroke-width:2px,color:#fff;
classDef network fill:#0f172a,stroke:#3b82f6,stroke-width:1.5px,color:#fff;
classDef compute fill:#1e1b4b,stroke:#8b5cf6,stroke-width:1.5px,color:#fff;
classDef storage fill:#052e16,stroke:#22c55e,stroke-width:1.5px,color:#fff;
classDef security fill:#3f1d2e,stroke:#f43f5e,stroke-width:1.5px,color:#fff;

class USER root;
`);

  [...addedNodes].forEach((id) => {
    if (id.startsWith("VPC") || id.startsWith("SUBNET") || id.startsWith("IGW") || id.startsWith("RT") || id.startsWith("NAT")) {
      lines.push(`class ${id} network;`);
    } else if (id.startsWith("EC2")) {
      lines.push(`class ${id} compute;`);
    } else if (id.startsWith("S3")) {
      lines.push(`class ${id} storage;`);
    } else if (id.startsWith("SG")) {
      lines.push(`class ${id} security;`);
    }
  });

  return lines.join("\n");
}
