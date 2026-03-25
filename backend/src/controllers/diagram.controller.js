import { buildDiagram } from "../services/diagram.service.js";

export function generateDiagram(req, res) {
  try {
    const { terraform } = req.body;

    if (!terraform || typeof terraform !== "string") {
      return res.status(400).json({
        success: false,
        error: "terraform is required"
      });
    }

    const diagram = buildDiagram(terraform);

    return res.json({
      success: true,
      diagram
    });
  } catch (error) {
    console.error("generateDiagram error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate diagram"
    });
  }
}