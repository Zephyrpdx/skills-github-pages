# Agent-Readable Skills Infrastructure
## A Three-Level Teaching Curriculum

*From Brittle Prompts to Production-Grade Agent Primitives*

**Level 1 — Foundations · Level 2 — Agentic Contracts · Level 3 — Enterprise Governance**

---

## How to Use This Curriculum

This curriculum uses evidence-based learning science. Each module follows a deliberate structure:

- **Conceptual Reading** — Explains the "why" and the "what" with worked examples.
- **Recall Checks** — Pause and retrieve what you just learned. Do not skip these.
- **Worked Examples** — Complete skill.markdown files and pipeline diagrams to study before creating your own.
- **Mini-Quizzes** — Short assessments at the end of each module.
- **Comprehensive Level Quiz** — Cumulative assessment covering all modules in a level.
- **Flashcard Reference** — Key vocabulary for spaced repetition review.

> **⚡ The Pomodoro Method:** Work in focused 25-minute sessions with no distractions, followed by a 5-minute break. Each module fits within 1–2 Pomodoro sessions.

> **⚠️ Watch for the Illusion of Competence:** Reading a worked example and thinking "I understand this" is NOT the same as being able to produce it yourself. After every worked example, cover it and try to reconstruct it from memory.

---

## Curriculum Map

| Level | Theme | Modules |
|-------|-------|---------|
| **Level 1 — Foundations** | Understanding and building a single skill primitive | M1: Why Skills Matter · M2: Anatomy of a Skill · M3: Writing Your First Skill |
| **Level 2 — Intermediate** | Agentic contracts and multi-skill pipelines | M4: Agentic Contracts · M5: Composability & Pipelines · M6: Debugging Failure Modes |
| **Level 3 — Advanced** | Enterprise governance and quantitative testing | M7: Governance Tiers · M8: Quantitative Testing · M9: Enterprise Deployment |

---

# LEVEL 1 — FOUNDATIONS OF AGENT-READABLE SKILLS

*Understanding what skills are, why they exist, and how to build your first one.*

---

## Module 1 — Why Skills Matter: The Problem With Prompts

**Estimated time:** 1 Pomodoro (25 minutes)

### 1.1 The Brittle Prompt Problem

Prompts break for a surprising number of reasons:

- A colleague edits a shared prompt to fix one use case, accidentally breaking three others.
- The AI model is updated by the vendor, and subtle behavior changes mean old prompts produce unexpected output formats.
- A new team member asks the AI to do the same task but phrases it differently — and gets a completely different structure back.
- You need an autonomous agent to call a tool hundreds of times; your human-friendly prose prompt gives no deterministic contract about what it should output.

These are not edge cases. They are the normal lifecycle of prompt-based workflows at scale. The root cause is that prompts are written for human conversations — they are fluid, context-dependent, and hard to version-control.

### 1.2 The Skill Primitive: A Better Abstraction

A `skill.markdown` file solves these problems by replacing ad-hoc prompts with structured, version-controlled primitives. Think of a skill the way a software engineer thinks of a function: it has a clear name, defined inputs, specified outputs, and documented edge cases. Unlike a function, it is written in markdown so that an LLM can read and execute it — but it is engineered with the rigor of code.

> **Key Insight — The Skill as a ZIP File:** Just as chunking in human memory condenses complex information into a single, easily-accessible unit, a `skill.markdown` file condenses complex behavioral instructions into a single, reliably-routable primitive. Your LLM's working memory is limited — a well-designed skill reduces cognitive load on the model the same way chunking reduces load on human working memory.

### 1.3 A Concrete Comparison

| ❌ BRITTLE PROMPT (Conversational) | ✅ SKILL PRIMITIVE (Structured) |
|---|---|
| *"You are a helpful assistant. When asked about competitors, please provide a useful and thorough analysis covering things like their pricing, what their product does, and any weaknesses you know about."* | *Triggers on "analyze competitors" or "market players." Outputs a 4-column markdown matrix: Competitor Name \| Pricing Tier \| Market Share Estimate \| Key Technical Gap. Always outputs exactly 5 rows.* |
| No guaranteed structure. Output changes with every run. An agent cannot parse it reliably. | Deterministic structure. Parseable by downstream agents. Clear trigger phrase. Versioned and testable. |

### 1.4 Where Skills Live

A skill is a directory containing a single required file: `skill.markdown` (or `SKILL.md`). The directory name identifies the skill.

```
skills/
  competitor-analysis/
    skill.markdown
  meeting-summary/
    skill.markdown
    example-input.txt      ← optional supporting files
  tenant-health-audit/
    skill.markdown
```

Skills are stored in version-controlled repositories — not buried in individual chat windows or shared documents. This makes them auditable, updateable, and recoverable if someone leaves the organization.

> **🔁 RECALL CHECK** — Cover the page and answer from memory:
> 1. What is the core problem that skill primitives solve, in one sentence?
> 2. What is the difference between a brittle prompt and a skill primitive?
> 3. Where does a `skill.markdown` file live, and why does that location matter?

### Module 1 Mini-Quiz

**Q1.** What is the primary failure mode of conversational prompts used at scale?
- A. They are too short to be useful
- **B. They are fluid, context-dependent, and hard to version-control** ✓
- C. They require too much computing power
- D. They cannot be written in markdown

**Q2.** Which analogy best describes the purpose of a `skill.markdown` file?
- A. A personal diary entry
- **B. A software function with defined inputs, outputs, and documented edge cases** ✓
- C. A freeform brainstorming document
- D. A conversational chat history

**Q3.** Why is storing skills in version-controlled repositories important?
- A. So they take up less storage space
- B. So they can be shared on social media
- **C. So they are auditable, testable, updatable, and recoverable when team members leave** ✓
- D. So the AI model can update them automatically

---

## Module 2 — Anatomy of a Skill Primitive

**Estimated time:** 2 Pomodoro sessions (50 minutes)

### 2.1 The Two-Part Structure

Every `skill.markdown` file has exactly two parts: a **frontmatter section** (metadata) and a **body section** (operational instructions).

```markdown
---
name: competitor-analysis
description: "Triggers on 'analyze competitors' or 'market players' to output a 4-column markdown matrix: Competitor | Pricing | Market Share | Gap."
---

# Body: Reasoning frameworks, output specs, edge cases, and examples go here.
```

> **Critical Rule — One-Line Description:** The `description` field MUST fit on a single continuous line. LLM routing parsers read descriptions as single tokens. If an auto-formatter wraps the description across multiple lines, the parser reads only the first line — and the rest of your routing criteria become invisible. This single rule causes more routing failures than any other mistake.

### 2.2 The Routing Description: Your Most Important Line

The description is the primary signal an LLM gateway uses to decide whether to invoke a skill.

**Principle 1: Use Concrete Trigger Phrases**

| ❌ Vague (Under-triggers) | ✅ Concrete (Reliably triggers) |
|---|---|
| *"Assists enterprise analysts with competitive analysis and market overviews."* | *"Triggers on 'analyze competitors' or 'market players' to output a 4-column markdown matrix: Competitor \| Pricing \| Market Share \| Technical Gap."* |

**Principle 2: Include Output Shape**

Descriptions that specify the artifact type (matrix, table, report, JSON block) help the model understand not just when to fire the skill, but what the goal state looks like. This significantly reduces format drift across sessions.

### 2.3 The Five Subsystems of a Skill Body

The body of a `skill.markdown` file is built from five declarative subsystems — NOT a sequential list of instructions.

**Subsystem 1: Reasoning Frameworks**
- **What it is:** Encoded quality criteria, decision principles, and domain mental models.
- **Why it matters:** Allows the model to generalize when encountering situations the author didn't explicitly anticipate.
- **Example:**
  ```
  ## Reasoning Framework
  Prioritize competitors with documented API offerings.
  If revenue data is unavailable, estimate from employee count using $150k/employee heuristic.
  Rank by market share descending. Ties broken alphabetically.
  ```

**Subsystem 2: Deterministic Output Specifications**
- **What it is:** Absolute formatting criteria — exact column names, field lengths, schema, encoding.
- **Why it matters:** Agents consuming this skill's output cannot tolerate ambiguity. If the output schema changes between runs, downstream parsing fails silently.
- **Example:**
  ```
  ## Output Format
  | Competitor | Pricing Tier | Market Share % | Key Gap |
  |---|---|---|---|
  Exactly 5 rows. No markdown outside the table. No footnotes.
  ```

**Subsystem 3: Explicit Boundary Edge Cases**
- **What it is:** Documented operational failure states and constraint conditions.
- **Why it matters:** Models default to hallucinating plausible-sounding output when they hit an undocumented edge.
- **Example:**
  ```
  ## Edge Cases
  If fewer than 5 competitors are identifiable, output "INSUFFICIENT DATA" in remaining rows.
  If the user asks about a private company, note "(private, estimated)" in the Pricing Tier field.
  Never include the client's own company in the matrix.
  ```

**Subsystem 4: Pattern-Matching Exemplars**
- **What it is:** Static examples stored in the skill directory for few-shot performance.
- **Why it matters:** Demonstrating correct output is almost always more effective than describing it.
- **Example:**
  ```
  ## Example Output
  | Acme Corp | Enterprise ($50k+/yr) | 22% | No mobile SDK |
  | BetaCo    | SMB ($99/mo)          |  8% | No SSO support |
  ```

**Subsystem 5: Contextual Economy**
- **What it is:** The constraint that the entire skill file stays under 150 lines.
- **Why it matters:** Skills that bloat beyond 150 lines consume context the model needs for the actual task. The discipline forces clarity — if you can't say it in 150 lines, the skill is probably doing too much and should be split.

### 2.4 The Critical Constraint: 150-Line Maximum

This is not an arbitrary aesthetic preference. Enterprise LLM gateways often inject additional system context around your skill at runtime. A skill that balloons to 300 lines may work in isolation but fail in production because the gateway's surrounding context pushes it past the model's attention horizon.

If you find yourself consistently exceeding it, the skill is doing two jobs — split it into two skills.

> **🔁 RECALL CHECK** — Cover the page and answer from memory:
> 1. Name the five subsystems of a skill body without looking.
> 2. Why must the description field be a single continuous line?
> 3. What is the maximum recommended length for a `skill.markdown` file, and why?
> 4. What is the danger of a sequential "Step 1, Step 2" instruction body instead of declarative subsystems?

### Module 2 Mini-Quiz

**Q1.** An auto-formatter wraps a 90-word routing description across 3 lines. What is the likely consequence?
- **B. The routing parser reads only the first line, making the remaining routing criteria invisible** ✓

**Q2.** Which subsystem is most responsible for preventing silent output format drift across agent runs?
- **C. Deterministic Output Specifications** ✓

**Q3.** Why are Pattern-Matching Exemplars stored as separate files in the skill directory?
- **B. To serve as reference vectors for few-shot performance, demonstrating correct output more effectively than description alone** ✓

**Q4.** What is the primary purpose of the Explicit Boundary Edge Cases subsystem?
- **B. To remove undocumented default model assumptions by explicitly defining what the model should do when constraints fail** ✓

---

## Module 3 — Writing Your First Skill

**Estimated time:** 2 Pomodoro sessions (50 minutes + practice)

### 3.1 The Description Formula

```
description: "Triggers on [EXACT TRIGGER PHRASE 1] or [TRIGGER PHRASE 2] to [ACTION VERB] [OUTPUT ARTIFACT]: [SCHEMA DETAILS]. [KEY CONSTRAINTS]."
```

Applied examples:
- `"Triggers on 'summarize meeting' or 'meeting notes' to output a structured markdown summary: Attendees | Key Decisions | Action Items (owner + due date). Maximum 300 words."`
- `"Triggers on 'audit tenant' or 'health check' to produce a 5-section M365 tenant audit report covering: Identity, Licensing, Security Defaults, Conditional Access, and SharePoint Permissions."`
- `"Triggers on 'parse deployment log' to extract a JSON block with fields: timestamp, service_name, exit_code, error_summary. One object per log line. Malformed lines output null."`

### 3.2 Worked Example: Building a Skill From Scratch

We will build a complete skill for a **Meeting Action Item Extractor**. After reading, cover the page and try to reconstruct the final file from memory.

**Step 1: Define the trigger and output**

Before writing a single line, answer two questions in plain English:
- WHEN should this skill fire? → "When someone shares meeting transcript text and asks for action items."
- WHAT should the output look like? → "A numbered list of action items, each with an owner name and due date."

**Step 2: Write the description (one line)**

```
description: "Triggers on 'action items' or 'extract tasks' from meeting transcripts to output a numbered list: [Owner] — [Action] — [Due Date]. Flag items with no owner as UNASSIGNED."
```

> **Stop! One-Line Check:** Count the newlines in your description. There should be zero. If your text editor wrapped it, put it back on one line.

**Step 3: Write the Reasoning Framework**

```markdown
## Reasoning Framework
Extract only explicitly stated actions — do not infer implied tasks.
If a person's name appears within 10 words of an action verb, treat them as the owner.
If no due date is stated, check for relative references ("by Friday", "next week") and
convert to absolute dates using the meeting date if provided.
Rank output by due date ascending. No due date items appear last.
```

**Step 4: Write the Output Specification**

```markdown
## Output Format
1. [Owner Name] — [Action description] — [Due: YYYY-MM-DD or UNSCHEDULED]
2. ...

If no action items exist: output exactly "No action items identified."
No preamble. No summary paragraph. No markdown headers in output.
```

**Step 5: Document Edge Cases**

```markdown
## Edge Cases
If the input contains no discernible meeting content: output "INPUT_NOT_MEETING_TRANSCRIPT"
If owner is ambiguous (two names near same verb): list both separated by slash, e.g. "Alice/Bob"
If transcript exceeds 5,000 words: process the first 5,000 words only, append "[TRUNCATED]"
Never fabricate names not present in the input text.
```

**Step 6: Add an Exemplar**

```markdown
## Example Output
1. Sarah Chen — Schedule infrastructure review meeting — Due: 2025-06-15
2. Marcus / Dev Team — Migrate auth service to OAuth2 — Due: 2025-06-30
3. UNASSIGNED — Update onboarding documentation — UNSCHEDULED
```

**The Complete Skill File**

```markdown
---
name: meeting-action-extractor
description: "Triggers on 'action items' or 'extract tasks' from meeting transcripts to output a numbered list: [Owner] — [Action] — [Due Date]. Flag UNASSIGNED if no owner."
---

## Reasoning Framework
Extract only explicitly stated actions — do not infer implied tasks.
If a person's name appears within 10 words of an action verb, treat them as the owner.
If no due date is stated, check for relative references and convert to absolute dates.
Rank output by due date ascending. No due date items appear last.

## Output Format
1. [Owner Name] — [Action description] — [Due: YYYY-MM-DD or UNSCHEDULED]

If no action items exist: output exactly "No action items identified."
No preamble. No summary paragraph. No markdown headers.

## Edge Cases
If input is not a transcript: output "INPUT_NOT_MEETING_TRANSCRIPT"
Ambiguous owner: list both separated by slash.
Transcript over 5,000 words: process first 5,000 only, append "[TRUNCATED]"
Never fabricate names not present in the input.

## Example Output
1. Sarah Chen — Schedule infrastructure review — Due: 2025-06-15
2. UNASSIGNED — Update documentation — UNSCHEDULED
```

> **Line Count Check:** The file above is approximately 28 lines — well within the 150-line limit.

### 3.3 Common Mistakes and How to Fix Them

| Mistake | ❌ Bad | ✅ Good |
|---------|--------|---------|
| **Mistake 1: The Vague Trigger** | `description: "Helps users with their meetings and notes."` | `description: "Triggers on 'action items' or 'meeting notes' to output..."` |
| **Mistake 2: The Procedural Body** | `Step 1: Read text. Step 2: Find names. Step 3: Find verbs.` | `## Reasoning Framework` with declarative decision policies |
| **Mistake 3: The Ambiguous Output** | `## Output: Write up the action items you find.` | `## Output Format: 1. [Owner] — [Action] — [Due: YYYY-MM-DD]` |

### 3.4 Practice Assignment

Build a production-grade skill of your own. Your submission must include:

- [ ] A single-line description with concrete trigger phrases
- [ ] A Reasoning Framework (declarative, not procedural)
- [ ] A Deterministic Output Specification (exact schema)
- [ ] At least three Edge Cases
- [ ] One Example Output (exemplar — inline or separate file)
- [ ] Total file length under 150 lines

---

# LEVEL 2 — AGENTIC CONTRACTS & COMPOSABLE PIPELINES

*Designing skills for autonomous agents and multi-skill pipelines.*

---

## Module 4 — Agentic Contracts: Skills Built for Autonomous Agents

**Estimated time:** 1–2 Pomodoro sessions

### 4.1 The Shift From Human-Directed to Agent-Directed Skills

When a human reads your skill output, they can apply judgment to handle format variation. When an autonomous agent reads your skill output, it cannot. The shift is from **flexible instructions** to a **strict API specification**.

| Recipe (Human-Directed) | API (Agent-Directed) |
|---|---|
| "add salt to taste" | `salt: float, grams, range 0.0–5.0, default 2.0` |
| Relies on human judgment | Requires strict, mechanical parameter specifications |

### 4.2 The Agentic SLA Contract

Level 2 skills add four structural blocks to the standard skill body:

**1. Input Contract** — Declares all required and optional input fields with types, formats, and constraints.

```markdown
## Input Contract
Required: transcript_text (string, plain text, UTF-8, max 5000 words)
Optional: meeting_date (string, ISO 8601, e.g. 2025-06-15)
```

**2. Output Contract** — Declares all possible output schemas including success paths and STATUS_CODE failure states.

```markdown
## Output Contract
Success: numbered list rows — [Owner] | [Action] | [Due: YYYY-MM-DD or UNSCHEDULED]
Failure: STATUS: NO_ITEMS_FOUND
Failure: STATUS: INPUT_NOT_MEETING_TRANSCRIPT
Failure: STATUS: INVALID_INPUT_FORMAT
```

**3. Dependency Contract** — Declares upstream preconditions that must hold for the skill to function.

```markdown
## Dependency Contract
Input must be UTF-8 encoded plain text. HTML, DOCX, or binary input will emit STATUS: INVALID_INPUT_FORMAT.
```

**4. Downstream Assumption Contract** — Declares guarantees the calling agent can rely on.

```markdown
## Downstream Assumption Contract
Output rows are always sorted ascending by due date. Undated items always appear last.
Date format is always ISO 8601 (YYYY-MM-DD). Never a localized date string.
```

### 4.3 Worked Example: Human Skill vs. Agentic Skill

**Human Skill Edge Case:**
```
If no action items found, politely explain that the transcript contained no action items.
```

**Agentic Skill Edge Case:**
```
If no action items found: output "STATUS: NO_ITEMS_FOUND" on a single line. No other output.
```

The human-friendly version produces natural language that downstream agents cannot parse mechanically. The agentic version produces a predictable STATUS_CODE that pipelines can route on.

> **🔁 RECALL CHECK** — Cover the page and answer from memory:
> 1. What are the four blocks of an Agentic SLA Contract?
> 2. Why must failure states be STATUS_CODEs rather than natural language?
> 3. What is the 'recipe vs. API' analogy?

### Module 4 Mini-Quiz

**Q1.** Why must agentic skills emit STATUS_CODEs instead of prose error messages?
- **B. Automated pipelines crash when their mechanical parsing logic encounters conversational failure prose** ✓

**Q2.** A skill outputs a 'Date' field as a plain text string. What makes it agent-ready?
- **The Output Contract must specify ISO 8601 encoding** ✓

---

## Module 5 — Composability: Building Multi-Skill Pipelines

**Estimated time:** 1–2 Pomodoro sessions

### 5.1 What Is Composability?

**Composability** is the property of a skill pipeline where each skill's output natively serves as the next skill's input without human intervention, data transformation, or re-prompting.

Composability failures are among the most expensive failure modes in multi-agent systems because they are **silent**. The pipeline does not crash — it continues running with subtly corrupted data, producing plausible but wrong results.

### 5.2 Designing for Handoff

The key design rule: **design Output Contracts first, then work backwards** to design the Reasoning Framework that produces them.

**Skill Alpha — Meeting Action Extractor (Output-First Design)**

```markdown
## Output Contract (Skill Alpha)
pipe-delimited rows: owner│action│due_date_iso│urgency_score
urgency_score: integer 1-5 (5 = most urgent)
STATUS: NO_ITEMS_FOUND if no actions exist

Note: urgency_score field is intentionally left for Skill Beta to populate.
Alpha outputs urgency_score = 0 for all rows as a placeholder.
```

**Skill Beta — Urgency Scorer (Input-First Design)**

```markdown
## Input Contract (Skill Beta)
Required: action_rows (pipe-delimited string, format: owner│action│due_date_iso│urgency_score)
Each row: urgency_score field must be present (value 0 = unscored, 1-5 = already scored)

## Output Contract (Skill Beta)
Same pipe-delimited format, urgency_score populated: 1-5
Sorted descending by urgency_score, then ascending by due_date_iso
STATUS: INVALID_INPUT_FORMAT if pipe structure does not match
```

> **The Handoff Principle:** Skill Alpha adds an `urgency_score` field populated with `0` even though it cannot score urgency. This **placeholder** is critical — it ensures the schema is consistent whether or not prior scoring occurred. Without the placeholder, Beta would receive a 3-field row when it expects 4 fields, causing a silent parse failure.

### 5.3 The Data Flow Diagram

Always document multi-skill pipelines with a data flow diagram:

```
┌─────────────────────────────────────────────────────────────┐
│  INPUT: Raw meeting transcript (plain text, UTF-8)          │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  SKILL ALPHA: meeting-action-extractor-v2                   │
│  Output: owner│action│due_date_iso│urgency_score(=0)        │
└────────────────────────────┬────────────────────────────────┘
                             │  pipe-delimited rows
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  SKILL BETA: urgency-scorer                                 │
│  Input:  owner│action│due_date_iso│urgency_score            │
│  Output: same schema, urgency_score 1-5, sorted             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  FINAL OUTPUT: Prioritized action item list                 │
└─────────────────────────────────────────────────────────────┘
```

### 5.4 When NOT to Use a Skill: The Deterministic Script Rule

If a workflow step requires absolute, non-negotiable deterministic execution — implement it as a hardwired script (Python, Bash, etc.), not an LLM skill.

| Use a Skill When... | Use a Script When... |
|---|---|
| Extracting structured data from unstructured text | Parsing a known CSV format with fixed columns |
| Scoring or classifying items using judgment | Converting a date string from one format to another |
| Summarizing variable-length content | Renaming files according to a naming convention |
| Generating narrative from structured data | Sending an email via SMTP |
| Identifying entities in natural language | Inserting a row into a database |

> **🔁 RECALL CHECK** — Cover the page and answer from memory:
> 1. Define composability in one sentence.
> 2. What is the "placeholder field" strategy and why is it important?
> 3. Give two examples of tasks that should be hardwired scripts rather than LLM skills.
> 4. What is a silent composability failure, and why is it dangerous?

### Module 5 Mini-Quiz

**Q1.** Skill A output: `"owner│action│due_date"`. Skill B input contract expects: `"owner│action│due_date│urgency"`. The pipeline fails. What is the correct fix?
- **B. Add a placeholder urgency field (value: 0) to Skill A's output so its schema is always 4 fields** ✓

**Q2.** A workflow step must insert validated records into a production database with zero tolerance for errors. Should this be an LLM skill or a hardwired script?
- **B. A hardwired script, because this step requires absolute deterministic execution with no reasoning latitude** ✓

---

## Module 6 — Debugging Skills and Identifying Failure Modes

**Estimated time:** 1 Pomodoro session

### 6.1 A Taxonomy of Skill Failures

| Failure Type | Symptoms | Diagnostic Target |
|---|---|---|
| **Routing Failure** | Skill never invokes despite matching user query. Agent uses default behavior. | Check: Description is single-line. Trigger phrases match actual user language. Description is specific, not vague. |
| **Output Drift** | Skill invokes correctly but output structure varies between runs. Downstream parsing intermittently fails. | Check: Output Spec is deterministic. No prose-style output instructions. Failure states emit STATUS_CODEs. |
| **Pipeline Break** | Upstream skill succeeds. Downstream skill receives input but fails silently or emits INVALID_INPUT. | Check: Alpha output schema maps exactly to Beta input schema. Field names, delimiter, and encoding match. |

### 6.2 The Debugging Checklist

Work through this checklist in order when a skill fails in production:

1. Is the description on exactly one line? *(Open the raw file, not a rendered preview)*
2. Do the trigger phrases match the actual language the calling agent uses?
3. Is the Output Spec entirely deterministic? Remove any prose-style output instructions.
4. Do all failure paths emit machine-parseable STATUS_CODEs?
5. If this is a pipeline skill: compare Alpha Output Contract field-by-field with Beta Input Contract.
6. Is the total file under 150 lines? If not, split the skill.
7. Does the Reasoning Framework contain step-by-step procedural instructions? Replace with declarative policies.

### Level 2 Comprehensive Quiz

**Q1.** You build a two-skill pipeline. Skill A output: `"owner│action│due_date"`. Skill B input contract expects: `"owner│action│due_date│urgency"`. What is the correct fix?
- **B. Add a placeholder urgency field (value: 0) to Skill A's output** ✓

**Q2.** An agentic skill's edge case reads: "If no data is found, explain politely that the query returned no results." Why is this a critical design flaw?
- **B. Natural language failure messages cannot be reliably parsed by downstream agents — failure states must be STATUS_CODEs** ✓

**Q3.** What is "output drift" and what is its primary cause?
- **B. When a skill invokes correctly but produces structurally variable output across runs due to an insufficiently deterministic output specification** ✓

**Q4.** Which of the following tasks should NOT be implemented as an LLM skill?
- **C. Sending a confirmation email via SMTP with a fixed template** ✓

---

# LEVEL 3 — ENTERPRISE GOVERNANCE & QUANTITATIVE TESTING

*Scaling skills across organizations with governance tiers, testing harnesses, and continuity planning.*

---

## Module 7 — The Three-Tier Governance Hierarchy

**Estimated time:** 1–2 Pomodoro sessions

### 7.1 Why Governance Matters

A single skills repository shared across a 500-person company without governance is a liability: skills conflict, override each other, become stale without anyone noticing, and create critical single points of failure.

Governance answers one question for every skill: **who owns it, who can change it, and where does it live?**

### 7.2 The Three Tiers

**Tier 1: Standard Organizational Skills**
- **Owner:** Enterprise Administrators
- **Examples:** Brand voice profiles, regulatory compliance parameters, M365 template schemas, data classification rules
- **Key characteristics:** Universally applicable. Managed centrally with formal change control. Versioned with mandatory regression testing before deployment. Least frequently updated — stability is paramount.
- **Important limitation:** Tier 1 skills CANNOT capture institutional methodology. They can enforce company letterhead. They cannot encode the specific due-diligence framework your M&A team uses. That knowledge lives in Tier 2.

**Tier 2: Team Methodology Skills**
- **Owner:** Business-Unit Teams (Senior Practitioners)
- **Examples:** Domain-specific technical review frameworks, deal analysis protocols, security audit methodologies, sales qualification criteria
- **Key characteristics:** High institutional value — encodes "how we do things here" knowledge. Must be authored or heavily reviewed by senior practitioners, not IT administrators. The most strategically valuable tier — losing these skills means losing institutional alpha.
- **Important limitation:** Tier 2 skills CANNOT be engineered top-down by IT. An enterprise administrator writing a due-diligence skill without M&A domain expertise produces a technically valid but operationally useless skill.

**Tier 3: Personal Workflow Skills**
- **Owner:** Individual Contributors
- **Examples:** Personal formatting preferences, individual research workflows, custom report templates, shortcuts for repetitive tasks
- **Key characteristics:** Edge productivity automations tailored to individual work styles. Fastest to create and most rapidly iterated. Highest continuity risk if not version-controlled.
- **Critical failure mode:** When the skill lives only on one person's laptop and they leave the organization, the skill — and all the productivity it enabled — leaves with them.

### 7.3 Tier Promotion: When Personal Skills Become Organizational Assets

One of the highest-value governance activities is **tier promotion**:

1. **Identify:** Team leads review Tier 3 skills quarterly for patterns that indicate shared value.
2. **Generalize:** The skill is rewritten to remove personal idiosyncrasies and edge cases specific to one person's workflow.
3. **Validate:** The domain expert who used the skill reviews the generalized version for correctness.
4. **Promote:** The skill moves to the team repository and Tier 1 or Tier 2 governance controls apply.

> **🔁 RECALL CHECK** — Cover the page and answer from memory:
> 1. What are the three governance tiers and who owns each one?
> 2. Why can a Tier 2 methodology skill NOT be engineered by an IT administrator?
> 3. What is the primary continuity risk for Tier 3 skills?
> 4. Describe the tier promotion process in your own words.

### Module 7 Mini-Quiz

**Q1.** Your company's M&A team has a proprietary deal analysis framework built up over 15 years. An IT administrator offers to encode this into a skill. What tier should this skill be, and what is the risk?
- **B. Tier 2; the risk is that IT lacks the domain expertise to encode the methodology correctly** ✓

**Q2.** An individual contributor builds an excellent research workflow skill and keeps it in a folder on their local machine. They then leave the organization. What risk does this represent?
- **B. A Tier 3 continuity failure — the skill leaves with the employee because it was not committed to a version-controlled team repository** ✓

---

## Module 8 — Quantitative Testing: Why Manual Testing Fails

**Estimated time:** 2 Pomodoro sessions

### 8.1 The Transformer Sensitivity Problem

A developer changes a single adjective in a Tier 1 formatting skill — from "concise" to "brief" — to fix a minor layout issue. A week later, a completely unrelated data-parsing skill starts producing malformed output.

How is this possible? Transformers process your entire skills context as a **unified semantic field**. A change in one part of the context shifts the probability distributions across all downstream token generation. Small, seemingly isolated changes can produce unpredictable cascading effects on skills that share context.

Manual testing catches only the skill you changed. Quantitative regression testing catches cross-skill effects.

### 8.2 The Quantitative Testing Harness

A testing harness requires three components:

**Component 1: Static Test Cases**

A fixed, unchanging set of inputs paired with their expected outputs. Each test case should represent a distinct category:
- **Happy path:** well-formed input that should produce clean output.
- **Edge case:** input at a documented constraint boundary.
- **Failure path:** input that should trigger a STATUS_CODE.

**Component 2: Numeric Scoring Rubric (1–5 Scale)**

> **Critical Design Rule:** NEVER use subjective rubric criteria such as "Score 5 if the response looks professional." Every rubric criterion must be objectively verifiable by a parser, not a human reader.

| Score | Structural Criterion | Verification Method |
|-------|---------------------|---------------------|
| **5** | Output matches schema exactly. All fields present. Correct sort order. No extra text. | Parse output with schema validator. Zero parsing errors. Row count matches expected. |
| **4** | Output matches schema. One minor deviation (e.g., whitespace, trailing newline). | Schema validator passes after normalization (strip/trim). |
| **3** | Output has correct content but structural deviation (e.g., 3 of 4 fields present, or wrong delimiter). | Manual field extraction possible but automation requires additional handling. |
| **2** | Output contains correct information in incorrect format. Schema unrecoverable by parser. | Human can read it. Automated pipeline cannot parse it. |
| **1** | Output is a prose explanation, apology, or hallucinated content. | No structured data present. Pipeline cannot continue. |

**Component 3: Version Comparison Protocol**

1. Run the complete static test basket against the current (v1) skill. Record all scores.
2. Make the proposed change to create v2.
3. Run the complete static test basket against v2. Record all scores.
4. Compare score deltas across all test cases — **including test cases for adjacent skills that share context**.
5. Deploy only if: no test case scores dropped by more than 1 point, and no cross-skill regressions exceed 2 points.

### 8.3 Worked Example: A Testing Matrix

| Test ID | Test Type | Input Description | Score | Pass Threshold |
|---------|-----------|-------------------|-------|----------------|
| TC-001 | Happy Path | 500-word transcript, 3 clear action items, all owners named, all dates explicit | v1: 5 / v2: 5 | ≥ 4 |
| TC-002 | Edge — Ambiguous Owner | Transcript where two names appear near same verb | v1: 5 / v2: 4 | ≥ 4 |
| TC-003 | Edge — No Due Date | Action items with no time references | v1: 4 / v2: 5 | ≥ 4 |
| TC-004 | Failure Path | Input is a recipe, not a meeting transcript | v1: 5 / v2: 5 | = 5 (must emit STATUS_CODE) |
| TC-005 | Edge — Truncation | 6,000-word transcript | v1: 5 / v2: 4 | ≥ 4 |
| TC-006 | Regression (Adjacent) | Test case for Tier 1 brand voice skill | v1: 5 / v2: 5 | ≥ 4 (no regression) |

### Module 8 Mini-Quiz

**Q1.** A developer changes "concise" to "brief" in a Tier 1 skill. A regression test on an unrelated Tier 2 skill drops from score 5 to score 2. What is the most likely cause?
- **B. Transformer latent space sensitivity: the vocabulary change shifted probability distributions in the shared context, affecting adjacent skill outputs** ✓

**Q2.** A rubric criterion reads: "Score 5 if the output looks well-structured and professional." What is wrong with this criterion?
- **B. It is subjective — cannot be objectively verified by a parser, introducing evaluator bias** ✓

---

## Module 9 — Enterprise Deployment: Continuity, Version Control, and Scale

**Estimated time:** 1–2 Pomodoro sessions

### 9.1 The Version Control Imperative

Every skill at every tier must be committed to a version-controlled repository. This is not a best practice — it is a **non-negotiable infrastructure requirement**. Skills are organizational intellectual property. Losing them is equivalent to losing source code.

```
org-skills/                ← Version-controlled monorepo
  tier-1/                  ← Enterprise admin owned
    brand-voice/
    compliance-params/
    m365-templates/
  tier-2/                  ← Business unit owned
    finance/               ← Finance team methodology skills
    engineering/           ← Engineering review frameworks
    sales/                 ← Sales qualification criteria
  tier-3/                  ← Individual contributor skills (MUST be committed here)
    alice.chen/
    bob.torres/
  tests/                   ← Quantitative test harness
    test-cases/            ← Static input basket
    rubrics/               ← Scoring rubrics
    baselines/             ← v1 scores for regression comparison
```

### 9.2 Continuity Planning

| Risk | Trigger | Mitigation |
|------|---------|------------|
| **Skill Orphaning** | The only person who understands a Tier 2 skill leaves | Quarterly documentation reviews; skill promotion review process; README files per skill explaining business context |
| **Silent Regression** | A model vendor update changes behavior without announcement | Automated regression test suite runs on every model update; rollback playbook when scores drop below threshold |
| **Tier-3 Loss** | Individual contributor leaves with skills on local hardware | Policy: all skills must be committed to team repository. Enforced via offboarding checklist. |

### 9.3 Capstone Assignment

Design and document a complete two-skill pipeline for a use case in your organization. Your submission must include:

1. **Skill Alpha** — Complete `skill.markdown` with SLA Contract blocks
2. **Skill Beta** — Complete `skill.markdown` with SLA Contract blocks
3. **Data flow diagram** showing the Alpha-Beta handoff
4. **Tier classification and ownership assignment** for each skill
5. **A 6-case testing matrix** with numeric rubric criteria
6. **Version comparison protocol** documenting how you would validate Skill Alpha v2 before deployment

**Validation:** Both skills must be under 150 lines. All descriptions must be single-line. All failure states must emit STATUS_CODEs. No subjective rubric criteria.

### Level 3 Comprehensive Quiz

**Q1.** Why is Tier 2 skill authorship a domain expert responsibility rather than an IT administrator responsibility?
- **B. Tier 2 skills encode institutional methodology that exists only in practitioners' heads — an IT administrator lacks the domain expertise to author an operationally valid skill** ✓

**Q2.** An engineer changes one word in a Tier 1 skill without running regression tests. What is the systemic risk?
- **B. Cross-skill transformer sensitivity may cause undetected regressions in adjacent skills sharing the same context** ✓

**Q3.** A Tier 3 skill is stored only on a developer's local machine. They accept a position at another company. Which mitigation would have prevented this?
- **B. All Tier 3 skills must be committed to the team's version-controlled repository as a non-negotiable policy** ✓

**Q4.** A new LLM vendor update is released. Your testing harness shows 2 of 6 test cases for a critical Tier 2 skill dropped from score 5 to score 2. What is the correct response?
- **B. Do not deploy the model update for this skill context; invoke the rollback playbook and investigate the regressions before proceeding** ✓

---

# Master Glossary

| Term | Definition |
|------|-----------|
| **150-Line Constraint** | Maximum recommended skill file length to prevent context window overrun in production LLM gateways. |
| **Agentic SLA Contract** | Skill structure with Input, Output, Dependency, and Downstream Assumption Contracts for autonomous agent use. |
| **Brittle Prompt** | Ad-hoc conversational prompt lacking a deterministic contract. Behaves inconsistently and cannot be reliably versioned. |
| **Composability** | Skill pipeline property where each skill's output natively serves as the next skill's input without human intervention. |
| **Contextual Economy** | Discipline of keeping skill files under 150 lines to maintain context efficiency. |
| **Dependency Contract** | Declares upstream preconditions required for a skill to function correctly. |
| **Deterministic Output Spec** | Explicit schema defining exact output structure — columns, fields, row counts — for reliable downstream parsing. |
| **Deterministic Script Rule** | Any pipeline sub-task requiring zero-variance execution must be a hardwired script, not an LLM skill. |
| **Downstream Assumption Contract** | Declares what downstream agents can reliably expect from a skill's output. |
| **Edge Case Documentation** | Explicit instructions for constraint failure states that replace default model hallucination with defined policy. |
| **Input Contract** | Declares all required and optional input fields with types, formats, and constraints. |
| **Numeric Scoring Rubric** | 1–5 scale with objectively verifiable structural criteria for quantitative skill evaluation. |
| **Output Contract** | Declares all output schemas including success paths and STATUS_CODE failure states. |
| **Output Drift** | Structural variability in skill output across runs caused by insufficiently deterministic output specifications. |
| **Pattern-Matching Exemplar** | Static example output providing few-shot performance anchoring for the model. |
| **Placeholder Field** | A field added to upstream output to maintain schema consistency for downstream consumers. |
| **Reasoning Framework** | Declarative decision principles in the skill body enabling generalization to unanticipated situations. |
| **Routing Description** | The single-line frontmatter field used by LLM gateways to match user intent to a skill. |
| **Routing Failure** | Skill fails to invoke despite matching user query, typically caused by a vague or multi-line description. |
| **Silent Pipeline Failure** | Pipeline continues with corrupted data producing plausible but wrong results without emitting an error. |
| **Silent Regression** | Model update that degrades skill output quality without generating an alert. |
| **skill.markdown** | A structured markdown file providing a deterministic, version-controlled behavioral contract for an LLM. |
| **Static Test Basket** | Fixed, unchanging set of input-output test cases used as a baseline for version comparisons. |
| **Three-Tier Governance** | Skills management hierarchy: Tier 1 (org/IT), Tier 2 (team/domain), Tier 3 (personal/individual). |
| **Tier Promotion** | Process of elevating a Tier 3 skill to Tier 2 by generalizing, validating, and version-controlling it. |
| **Transformer Sensitivity** | Small vocabulary changes in one skill can unpredictably affect adjacent skills sharing context. |
| **Version Comparison Protocol** | Running static test basket against current and proposed skill versions before deploying changes. |

---

# Spaced Repetition Review Schedule

| Session | When | Activity |
|---------|------|----------|
| **Session 1** | Immediately after completing a level | Complete all Recall Checks without looking at content. Score yourself on each one. |
| **Session 2** | 24 hours after completion | Review flashcard reference. For any term you could not define, re-read that section only. |
| **Session 3** | 3 days after completion | Attempt to write a `skill.markdown` from scratch without looking at examples. Compare to worked examples. |
| **Session 4** | 1 week after completion | Complete the Level Comprehensive Quiz without notes. Any question below 80%: re-read that module. |
| **Session 5** | 1 month after completion | Review flashcards only. Any term you hesitate on: read that module's key paragraphs once more. |

---

> **Final Note to Students:** The goal of this curriculum is not to produce students who have read about skills — it is to produce practitioners who can **build** them. After completing all three levels, you should be able to author a production-grade skill, compose a multi-skill pipeline, assign it to the correct governance tier, and design a quantitative test harness for it. If you cannot do those four things from memory, revisit the relevant modules using the spaced repetition schedule above.
