export const dynamic = "force-static";

export function GET() {
  const content = `User-agent: *
Allow: /

# LLM agent discovery
Llms-txt: https://gists.sh/llms.txt
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
