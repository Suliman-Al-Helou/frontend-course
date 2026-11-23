import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const projectRoot = process.cwd();
const backendSpecPath = path.resolve(projectRoot, "../backendCourse/public/api.json");
const generatedTypesPath = path.resolve(projectRoot, "src/types/api.generated.ts");
const tmpTypesPath = path.resolve(projectRoot, "src/types/.api.generated.tmp.ts");

if (!fs.existsSync(backendSpecPath)) {
  console.warn("[CONTRACT GATE] ⚠️ backendCourse/public/api.json not found. Skipping contract parity check.");
  process.exit(0);
}

if (!fs.existsSync(generatedTypesPath)) {
  console.error("\n=======================================================");
  console.error("❌ [CONTRACT GATE FAILURE]: src/types/api.generated.ts is missing!");
  console.error("👉 Run `npm run sync:types` to generate contracts.");
  console.error("=======================================================\n");
  process.exit(1);
}

try {
  // Generate into temp file
  execSync(`npx openapi-typescript "${backendSpecPath}" -o "${tmpTypesPath}"`, { stdio: "ignore" });

  const currentContent = fs.readFileSync(generatedTypesPath, "utf-8");
  const freshContent = fs.readFileSync(tmpTypesPath, "utf-8");

  if (currentContent !== freshContent) {
    console.error("\n=======================================================");
    console.error("❌ [CONTRACT GATE FAILURE]: API Contract Drift Detected!");
    console.error("The backend OpenAPI spec (backendCourse/public/api.json) has changed,");
    console.error("but frontend-course/src/types/api.generated.ts is out of date.");
    console.error("👉 Run `npm run sync:types` to synchronize contracts before building.");
    console.error("=======================================================\n");
    if (fs.existsSync(tmpTypesPath)) fs.unlinkSync(tmpTypesPath);
    process.exit(1);
  }

  // Clean up
  if (fs.existsSync(tmpTypesPath)) fs.unlinkSync(tmpTypesPath);
  console.log("✅ [CONTRACT GATE PASSED]: API contracts are 100% in sync.");
  process.exit(0);
} catch (err) {
  if (fs.existsSync(tmpTypesPath)) fs.unlinkSync(tmpTypesPath);
  console.error("[CONTRACT GATE] Error checking contracts:", err.message);
  process.exit(1);
}
