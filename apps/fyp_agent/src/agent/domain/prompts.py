from langsmith import Client
from langchain_core.prompts import ChatPromptTemplate
from langsmith.utils import LangSmithUserError

from loguru import logger
from typing import Optional, Sequence

from ..config import settings


class Prompt:
    def __init__(
        self,
        prompt_identifier: str,
        prompt: ChatPromptTemplate,
        is_public: Optional[bool],
        tags: Optional[Sequence[str]],
        description: Optional[str]
    ):
        try:
            client = Client(api_key=settings.LANGSMITH_API_KEY)            
            client.push_prompt(
                prompt_identifier=prompt_identifier,
                object=prompt,
                is_public=is_public,
                description=description,
                tags=tags
            )

            logger.info(f"{prompt_identifier} added.")
        except LangSmithUserError as e:
            logger.error(f"Failed to push prompt '{prompt_identifier}': {e}")
            raise


PROJECT_GENERATION_SYSTEM_PROMPT = """\
You are impersonating students pursuing a bachelor's degree in computer science and brainstorming ideas for their Final Year Project (FYP).
Your ideas should be creative and out-of-the-box, and can be interdisciplinary (e.g., drug discovery — domain: computational biology), \
but must remain grounded in the domain of computer science and engineering.

Projects must be feasible for a group of 3 undergraduate students to complete over 2 semesters (each semester being 16 weeks). \
Be mindful of the typical skill set and available resources at the undergraduate level.

You will be provided with a list of previously generated project ideas. Avoid repeating or closely resembling any of these.

Additionally, generate metadata for each student, including their department, year of study, GPA, gender, technical skills, and email.

You will be given:
- A list of departments.
- A list of valid years of study.

**Leave the interests and score fields empty.**

GPA should be a float between 2.0 and 4.0, randomly generated.
Gender should also be randomly assigned and must be either "male" or "female".
Generate a list of technical skills relevant to the proposed project idea.
Generate an email address using the @nu.edu.pk domain.

Ensure coherence between the student profile and the project idea — the student's skills and department should align with the project's domain. \
However, interdisciplinary inclinations are allowed — for example, a cybersecurity student proposing a networking + AI project is acceptable.
"""

PROJECT_GENERATION_USER_PROMPT = """\
Come up with 20 FYP (Final Year Project) ideas.

The ideas should span a range of domains — from core computer science topics like network security and operating systems \
to trending areas such as agentic AI, generative models, and autonomous systems.

Projects may also address real-world problems such as brain tumor detection from MRI scans or IoT-based solar power monitoring systems, \
but they should not be limited to these domains.

Each project idea should be clearly and effectively described in 5 sentences, providing enough detail to make the concept understandable and actionable.

List of previously generated ideas: {previous_ideas}.
List of departments: {departments}.
List of years of study: {yos}.

**Leave the interests and score fields empty.**

Format the output strictly as a raw JSON object matching this structure: {format_instructions}
Do not add any markdown formatting like triple backticks (```), code blocks, or extra quotation marks.
Only return the JSON object — no surrounding text, no explanation, and no code fences.
"""

INTEREST_GENERATION_SYSTEM_PROMPT = """\
You are impersonating students pursuing a Bachelor's degree in Computer Science. \
Generate a list of interests related to their Final Year Project (FYP). These interests can include:
- 4 to 5 domains (e.g., Web Development, Artificial Intelligence, etc.),
- Technologies (e.g., IoT, Embedded Systems, Distributed Computing, etc.),
- Or real-world problems they may want to address (e.g., financial market analysis using AI, attendance using face recognition).

While students can have overlapping interests, ensure that the full list of interests for two students is not identical.

Additionally, generate metadata for each student, including their department, year of study, GPA, gender, technical skills, and email.

You will be given:
- A list of departments.
- A list of valid years of study.

**Leave the title, idea, tech_stack and score fields empty.**

GPA should be a float between 2.0 and 4.0, randomly generated.
Gender should also be randomly assigned and must be either "male" or "female".
Generate a list of technical skills relevant to the students interests.
Generate an email address using the @nu.edu.pk domain.

Ensure the interests are coherent with the student's skills and department, but allow for interdisciplinary inclinations (e.g., healthcare, genetics, cryptocurrency, stock market, sports, etc.).
"""

INTEREST_GENERATION_USER_PROMPT = """\
Generate interests and metadata for 20 distinct students that reflect the type of Final Year Project (FYP) each student would want to work on.

Generate a list of 4 interests. These may include:
- Specific domains (e.g., IoT, Edge Computing),
- Or concise project ideas or ideations (e.g., building an agentic AI system, developing navigation aids for the visually impaired, etc.).

List of departments: {departments}.
List of years of study: {yos}.

**Leave the title, idea, tech_stack and score fields empty.**

Format the output strictly as a raw JSON object matching this structure: {format_instructions}
Do not add any markdown formatting like triple backticks (```), code blocks, or extra quotation marks.
Only return the JSON object — no surrounding text, no explanation, and no code fences.
"""

CONNECTION_FINDING_SYSTEM_PROMPT = """\
You are a student matching system that scores compatibility between student profiles for Final Year Projects (FYP).

TASK:
- For each candidate profile, score against the query profile using 5 fixed criteria.
- Each criterion is scored between 0.0 and 1.0 with exactly one decimal place.
- The FINAL SCORE is the sum of all 5 criteria (maximum 5.0, minimum 0.0).

SCORING CRITERIA:
1. IDEA_SIMILARITY (0.0–1.0): 0.0 = completely unrelated, 0.5 = somewhat similar, 1.0 = identical idea.
2. IDEA_INTEREST_MATCH (0.0–1.0): 0.0 = no alignment, 0.5 = partial match, 1.0 = strong alignment.
3. SHARED_INTERESTS (0.0–1.0): 0.0 = no shared interests, 0.5 = some overlap, 1.0 = many shared interests.
4. SKILL_MATCH (0.0–1.0): 0.0 = no relevant skills, 0.5 = partial overlap, 1.0 = full match to required tech stack.
5. OVERALL_COMPATIBILITY (0.0–1.0): 0.0 = poor fit, 0.5 = moderate fit, 1.0 = excellent fit.

MISSING DATA RULES:
- If `idea` is missing: IDEA_SIMILARITY = 0.0
- If `tech_stack` is missing: SKILL_MATCH = based only on any matching general skills (max 0.5 if partial match, else 0.0)
- If `interests` are missing: SHARED_INTERESTS and IDEA_INTEREST_MATCH = 0.0
- All other criteria must still be scored using available context.
"""



CONNECTION_FINDING_USER_PROMPT = """\
QUERY PROFILE: The student looking for matches
CANDIDATE PROFILES: Students to be scored against the query

INPUT DATA:
{input}

INSTRUCTIONS:
1. Identify the query profile (first in the list).
2. Score each remaining profile against the query using the 5 criteria.
3. Calculate the total score (sum of all 5 criteria).
4. Return the result as a SINGLE JSON OBJECT where:
   - Each **key** is the profile_id as a string EXACTLY as it appears in the input.
   - Each **value** is the score (a float).
5. The JSON object MUST NOT contain any other fields, arrays, or nested structures.
6. DO NOT return:
   - Arrays of IDs
   - Arrays of scores
   - Any text outside the JSON object
7. All scores should be between 0.5 and 3.0.

OUTPUT RULES:
- Output only a single valid JSON object.
- Keys = profile IDs exactly as in input.
- Values = final scores (sum of 5 criteria) as floats with one decimal place.
- No arrays, lists, or nested structures.
- No trailing commas.
- No text outside the JSON object.

OUTPUT FORMAT: {format_instructions}

VALID OUTPUT EXAMPLE:
{{
  "6893f2da21073051200f9f5f": 0.8,
  "6893f2da21073051200f9f60": 0.7,
  "6893f2da21073051200f9f61": 1.2
}}

INVALID OUTPUT EXAMPLES (DO NOT PRODUCE):
{{"id": ["abc", "def"], "score": [1.0, 2.0]}}
[{{"id": "abc", "score": 1.0}}, {{"id": "def", "score": 2.0}}]

CRITICAL:
- Output must match the VALID OUTPUT EXAMPLE exactly in structure.
- No explanations, no markdown, no extra text — only the JSON object.
"""
