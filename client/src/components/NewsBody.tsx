import { looksLikeHtml, sanitizeArticleHtml } from "../features/news/sanitize";
import { splitNewsBody } from "../features/news/utils";

interface NewsBodyProps {
  body: string;
  className?: string;
}

export function NewsBody({ body, className = "j-news-prose max-w-3xl" }: NewsBodyProps) {
  if (looksLikeHtml(body)) {
    return (
      <div
        className={`${className} j-news-prose-html`}
        dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(body) }}
      />
    );
  }

  const paragraphs = splitNewsBody(body);
  return (
    <div className={className}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </div>
  );
}
