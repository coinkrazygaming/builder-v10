import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function GitHubDebug() {
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const testAPI = async () => {
    setIsLoading(true);
    setTestResult("");

    try {
      console.log("Testing GitHub API endpoint...");
      const response = await fetch("/api/github/test");
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      const text = await response.text();
      console.log("Response text:", text);
      
      if (response.ok) {
        try {
          const data = JSON.parse(text);
          setTestResult(`Success: ${JSON.stringify(data, null, 2)}`);
        } catch (parseError) {
          setTestResult(`Response received but not JSON: ${text}`);
        }
      } else {
        setTestResult(`Error ${response.status}: ${text}`);
      }
    } catch (error) {
      console.error("Test error:", error);
      setTestResult(`Request failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded">
      <h3 className="font-semibold">GitHub API Debug</h3>
      <Button onClick={testAPI} disabled={isLoading}>
        {isLoading ? "Testing..." : "Test GitHub API"}
      </Button>
      {testResult && (
        <Alert>
          <AlertDescription>
            <pre className="text-xs whitespace-pre-wrap">{testResult}</pre>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
