"""Extract large embedded images from brand guideline PDFs."""
import sys
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]


def extract(pdf_name: str, out_subdir: str, max_images: int = 24) -> None:
    pdf_path = ROOT / "docs/brand" / pdf_name
    out_dir = ROOT / "client/public/assets/projects" / out_subdir
    out_dir.mkdir(parents=True, exist_ok=True)
    ci_dir = out_dir / "ci"
    ci_dir.mkdir(exist_ok=True)

    doc = fitz.open(pdf_path)
    print(f"{pdf_name}: {doc.page_count} pages")

    seen_xrefs: set[int] = set()
    extracted: list[tuple[int, int, int, int, str, bytes, int]] = []

    for page_num in range(doc.page_count):
        page = doc[page_num]
        for img in page.get_images(full=True):
            xref = img[0]
            if xref in seen_xrefs:
                continue
            seen_xrefs.add(xref)
            try:
                base = doc.extract_image(xref)
            except Exception:
                continue
            w, h = base["width"], base["height"]
            if w < 200 or h < 200:
                continue
            ext = base["ext"]
            extracted.append((w * h, w, h, page_num + 1, ext, base["image"], xref))

    extracted.sort(reverse=True)
    print(f"  large images: {len(extracted)}")

    for i, (_, w, h, pg, ext, data, _xref) in enumerate(extracted[:max_images], 1):
        path = out_dir / f"ci-extract-{i}.{ext}"
        path.write_bytes(data)
        print(f"  {path.name} ({w}x{h}, page {pg})")

    for pg in range(doc.page_count):
        page = doc[pg]
        text = page.get_text().lower()
        if pg >= 14 or any(k in text for k in ("photography", "imagery", "lifestyle")):
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
            pix.save(str(ci_dir / f"guideline-page-{pg + 1}.png"))

    doc.close()


if __name__ == "__main__":
    targets = sys.argv[1:] or ["jamila"]
    mapping = {
        "jura": "Jura Brand Guidelines.pdf",
        "jamila": "JAMILA Brand Guidelines.pdf",
    }
    for key in targets:
        extract(mapping[key], key)
