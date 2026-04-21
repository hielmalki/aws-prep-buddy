Run the content parser to rebuild `packages/content/sections.json` and `packages/content/exams.json` from the source Markdown in the sibling repo at `../AWS-Certified-Cloud-Practitioner-Notes/`.

Steps:
1. Run `pnpm --filter content build` and show the output.
2. Report how many sections and how many total questions were parsed.
3. If any parse errors occur, list them with the source file and line number.
4. If the output JSON is missing or malformed, explain what went wrong.
