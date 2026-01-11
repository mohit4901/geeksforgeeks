exports.parseTerraform = (iac) => {
    const resources = [];
    const regex = /resource\s+"([^"]+)"\s+"([^"]+)"\s*{/g;
  
    let match;
    while ((match = regex.exec(iac)) !== null) {
      resources.push({
        type: match[1],
        name: match[2]
      });
    }
  
    return resources;
  };
  