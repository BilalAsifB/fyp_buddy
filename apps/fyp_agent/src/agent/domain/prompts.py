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

Format the output strictly as a raw JSON object matching this structure: {format_instructions}
Do not add any markdown formatting like triple backticks (```), code blocks, or extra quotation marks.
Only return the JSON object — no surrounding text, no explanation, and no code fences.
"""

CONNECTION_FINDING_SYSTEM_PROMPT = """\
Your job is to connect students based on their project ideas, interests, and skills. \
Your goal is to understand each student's profile and, based on the similarities of their ideas, \
interests, and how well their skills match the project's tech stack, score their compatibility.

You will be provided with 10 student profiles and a query profile. You must score each profile \
against the query profile using the following formula:

SCORE = (IDEA - IDEA) + (IDEA - INTERESTS) + (INTERESTS - INTERESTS) + (TECH-STACK - SKILLS) + COMPATIBILITY

You will score the following five categories, each ranging from 0 to 1:

1. **IDEA - IDEA**: Evaluate how closely the two project ideas relate. \
Score 0 if both ideas are completely different (e.g., one is about AI in healthcare, the other about 5G technology). \
Score 1 if the ideas are identical (e.g., both are about smart city systems).

2. **IDEA - INTERESTS**: Match the query profile’s project idea with the interests of the other profile. \
Score 0 if there is no alignment. Score 1 only if at least one interest fully aligns with the domain of the project idea, \
or if three or more interests partially relate. \
(Example: The project idea is "developing an AI companion", and the interests include human-computer interaction, \
exploring AI for human support, and building multimodal agents.)

3. **INTERESTS - INTERESTS**: Compare interests from both profiles. \
Score 0 if no interests match even partially. Score 1 only if at least three interests are similar.

4. **TECH-STACK - SKILLS**: Match the required tech stack from one profile’s idea to the skills in the other profile. \
Score 0 if none of the skills overlap. Score 1 if at least three skills are present in the tech stack.

5. **COMPATIBILITY**: Assess overall compatibility — how aligned both students are in terms of technical ability, \
ideation, and ambition. Assign a score between 0 and 1.

Each profile (query and candidates) will contain the following fields:
1. `id`: Student identifier.
2. `idea`: Project idea (may be missing).
3. `tech-stack`: Required technologies (may be missing).
4. `skills`: Skills the student possesses.

Ensure that the profile with the highest overall compatibility score reflects strong alignment in technical expertise, \
interests, ideation, and ambition.
"""

CONNECTION_FINDING_USER_PROMPT = """\
Score all 10 profiles against the query profile based on their compatibility. Input: {input} 
Associate each score with the profile's `id`.

Example Output Format:
{
  "student_1": 3.7,
  "student_2": 2.4,
  "student_3": 4.1,
  ...
}

Format the output strictly as a raw JSON object matching this structure: {format_instructions} \
Do not add any markdown formatting like triple backticks (```), code blocks, or extra quotation marks. \
Only return the JSON object — no surrounding text, no explanation, and no code fences.
"""
