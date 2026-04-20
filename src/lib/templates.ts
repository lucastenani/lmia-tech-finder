import { AUTHOR } from "@/config/author"
export const LINKEDIN_CHAR_LIMIT = 300

export interface EmailTemplate {
  body: string
  subject: string
}

export function buildEmailTemplate(record: {
  employer: string
}): EmailTemplate {
  const company = record.employer

  const subject = `Senior Frontend Engineer (${AUTHOR.stackShort}) interested in ${company}`

  const body = `Hi ${company} team,

I'm ${AUTHOR.name}, a ${AUTHOR.role} with ${AUTHOR.years}+ years of experience shipping production products with ${AUTHOR.stackFull}. Right now I split my time between a Senior Full-Stack role at an AI solutions company — where I lead the frontend of an international client product on Next.js + NestJS and maintain its design system — and a Founder Engineer role at an early-stage fashion startup where I own the frontend end-to-end.

[Why ${company}: one or two sentences on their product, tech stack, team, or a recent release. This is the single most important part of the email — replace this placeholder before sending.]

I'd love to learn whether your frontend team is currently hiring, or expects to open roles in the near future. A few highlights from my recent work:
- High-traffic React applications (one reaching 6.5M monthly visits)
- Design systems built with Tailwind, shared across multiple products
- Mentoring junior and mid-level frontend engineers

My resume and a short cover letter are attached.

Thanks for your time,
${AUTHOR.name}
${AUTHOR.linkedinUrl}
${AUTHOR.email}`

  return { subject, body }
}

export function buildLinkedInTemplate(record: { employer: string }): string {
  return `Hi [recipient],
I'm a ${AUTHOR.role} (${AUTHOR.years}+ yrs, ${AUTHOR.stackShort}) interested in frontend opportunities at ${record.employer}. Could you tell me if your team is hiring or point me to who could?
Best,
${AUTHOR.firstName}`
}
