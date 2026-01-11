exports.buildMermaidDiagram = (services) => {
    let diagram = "graph TD\n";
  
    services.forEach(s => {
      if (s.type === "ec2") diagram += "EC2[EC2 Instance]\n";
      if (s.type === "s3") diagram += "S3[S3 Bucket]\n";
      if (s.type === "vpc") diagram += "VPC[VPC]\n";
    });
  
    if (services.some(s => s.type === "ec2") && services.some(s => s.type === "s3")) {
      diagram += "EC2 --> S3\n";
    }
  
    return diagram;
  };
  