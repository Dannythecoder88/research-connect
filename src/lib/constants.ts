// Research categories with icons and colors
export const RESEARCH_CATEGORIES = [
  {
    id: "cs_ai",
    name: "Computer Science & AI",
    icon: "Cpu",
    color: "from-blue-500 to-indigo-600",
    description: "Machine learning, algorithms, software engineering, and artificial intelligence research",
  },
  {
    id: "biology",
    name: "Biology & Medicine",
    icon: "Dna",
    color: "from-emerald-500 to-green-600",
    description: "Molecular biology, genetics, neuroscience, public health, and clinical research",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: "FlaskConical",
    color: "from-amber-500 to-orange-600",
    description: "Organic, inorganic, analytical chemistry, and materials science",
  },
  {
    id: "physics",
    name: "Physics",
    icon: "Atom",
    color: "from-violet-500 to-purple-600",
    description: "Theoretical physics, quantum mechanics, astrophysics, and optics",
  },
  {
    id: "environmental",
    name: "Environmental Science",
    icon: "Leaf",
    color: "from-teal-500 to-cyan-600",
    description: "Climate science, ecology, sustainability, and conservation biology",
  },
  {
    id: "social_sciences",
    name: "Social Sciences",
    icon: "Users",
    color: "from-rose-500 to-pink-600",
    description: "Psychology, sociology, economics, political science, and education research",
  },
] as const;

export const SKILLS_LIST = [
  // Programming
  "Python",
  "Java",
  "JavaScript",
  "R",
  "MATLAB",
  "C/C++",
  "SQL",
  // Technical
  "Excel",
  "Statistics",
  "Data Analysis",
  "Machine Learning",
  "Lab Safety",
  "Microscopy",
  "PCR/Gel Electrophoresis",
  // Communication
  "Research Writing",
  "Public Speaking",
  "Presentation Design",
  "Literature Review",
  "Technical Documentation",
  // Soft Skills
  "Leadership",
  "Communication",
  "Teamwork",
  "Time Management",
  "Critical Thinking",
  "Problem Solving",
] as const;

export const COMMITMENT_TYPES = [
  { id: "summer", label: "Summer Only", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  { id: "school_year", label: "School Year", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  { id: "project", label: "Project Based", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  { id: "semester", label: "Semester Long", color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300" },
  { id: "ongoing", label: "Ongoing", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
] as const;

export const LOCATION_TYPES = [
  { id: "virtual", label: "Virtual", icon: "Monitor" },
  { id: "hybrid", label: "Hybrid", icon: "Building2" },
  { id: "in_person", label: "In Person", icon: "MapPin" },
] as const;

export const APPLICATION_STATUSES = [
  { id: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  { id: "under-review", label: "Under Review", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  { id: "interviewing", label: "Interviewing", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  { id: "accepted", label: "Accepted", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
  { id: "declined", label: "Declined", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Who can use CoLab?",
    answer: "CoLab is designed for high school students looking for research opportunities, and for professors, labs, startups, and organizations who want to mentor and work with motivated young researchers.",
  },
  {
    question: "Is there a cost to use the platform?",
    answer: "CoLab is completely free for both students and researchers. Our mission is to democratize access to research opportunities for high school students.",
  },
  {
    question: "How do I apply for a research position?",
    answer: "Create a student profile, browse available opportunities, and use the Easy Apply button to submit your profile along with a brief cover message explaining your interest.",
  },
  {
    question: "What if I have no prior research experience?",
    answer: "That's perfectly fine! Many positions are designed for beginners. Focus on highlighting your academic interests, relevant coursework, and eagerness to learn in your profile.",
  },
  {
    question: "How are labs and researchers verified?",
    answer: "All researcher and lab accounts go through an admin verification process before they can post positions. This ensures the safety and legitimacy of every opportunity on the platform.",
  },
  {
    question: "Can I apply to multiple positions?",
    answer: "Absolutely! You can apply to as many positions as you'd like. Use the Save feature to bookmark positions you're interested in and apply when you're ready.",
  },
];

export const RESOURCE_SECTIONS = [
  {
    id: "cold-email",
    title: "Cold Email Templates",
    icon: "Mail",
    content: `Writing a cold email to a professor can feel intimidating, but a well-crafted message can open doors. Here's what to include:

**Subject Line:** Be specific. Example: "High School Student Interested in [Specific Research Area] - Research Opportunity Inquiry"

**Template:**
Dear Professor [Last Name],

My name is [Your Name], and I am a [Grade] student at [High School Name]. I recently read your paper on [Specific Topic] and was fascinated by [Specific Finding].

I am writing to inquire about potential research opportunities in your lab. I am particularly interested in [Specific Area] because [Brief Reason]. I have experience with [Relevant Skills/Coursework].

I would welcome the opportunity to contribute to your research, even in a small capacity. I am available [Your Availability] and am willing to start with any tasks that would be helpful.

Thank you for your time and consideration. I have attached my resume for your reference.

Best regards,
[Your Name]

**Tips:**
- Keep it under 200 words
- Show you've actually read their work
- Be specific about what interests you
- Don't mass-send generic emails
- Follow up once after 1-2 weeks if no response`,
  },
  {
    id: "interview-prep",
    title: "Interview Preparation",
    icon: "MessageSquare",
    content: `If a researcher invites you for an interview, congratulations! Here's how to prepare:

**Before the Interview:**
- Research the lab's recent publications
- Understand the basics of their research area
- Prepare 3-5 thoughtful questions
- Review your own application materials

**Common Questions:**
1. "Why are you interested in research?"
2. "What do you know about our lab's work?"
3. "What relevant skills do you have?"
4. "How do you handle challenges or setbacks?"
5. "What are your time commitments?"

**What to Wear:**
- Business casual is appropriate
- Clean, neat appearance
- No need for a full suit

**During the Interview:**
- Be honest about your experience level
- Show enthusiasm and curiosity
- Take notes
- Ask about expectations and mentorship
- Be clear about your availability`,
  },
  {
    id: "research-etiquette",
    title: "Research Etiquette",
    icon: "BookOpen",
    content: `Working in a research environment has its own culture. Here are the unwritten rules:

**Communication:**
- Respond to emails within 24 hours
- Be proactive about asking questions
- Update your mentor on your progress regularly
- If you can't make it to lab, notify your mentor in advance

**In the Lab:**
- Always follow safety protocols
- Keep your workspace clean and organized
- Label everything clearly
- Document your work meticulously in a lab notebook
- Never touch equipment without training

**Professional Development:**
- Attend lab meetings and journal clubs
- Read papers related to your project
- Take initiative on small tasks
- Be open to feedback and constructive criticism

**Authorship & Credit:**
- Understand that authorship has specific criteria
- Keep records of your contributions
- Discuss expectations about credit early on`,
  },
  {
    id: "professional-communication",
    title: "Professional Communication",
    icon: "PenTool",
    content: `Communicating professionally is a skill that will serve you throughout your career:

**Email Etiquette:**
- Use a professional email address
- Always include a clear subject line
- Address people by their proper title (Dr., Professor)
- Proofread before sending
- Keep emails concise and focused

**Slack/Teams Communication:**
- Be responsive during agreed-upon hours
- Use threads to keep conversations organized
- Don't send multiple messages when one will do
- Use professional language (avoid excessive emojis)

**Presenting Your Work:**
- Practice your presentations multiple times
- Keep slides clean and minimal
- Speak clearly and at a moderate pace
- Be prepared for questions
- Thank your audience and mentors`,
  },
  {
    id: "finding-interests",
    title: "Finding Your Research Interests",
    icon: "Compass",
    content: `Not sure what you want to research? Here's how to explore:

**Start with What You Enjoy:**
- What classes excite you most?
- What topics do you read about voluntarily?
- What problems in the world frustrate you?

**Explore Broadly:**
- Watch TED talks on different scientific topics
- Read popular science books and magazines
- Follow researchers on social media
- Attend local science lectures or seminars

**Try Things Out:**
- Science fairs and competitions
- Online courses (MIT OpenCourseWare, Khan Academy, Coursera)
- Citizen science projects
- School clubs and organizations

**Talk to People:**
- Ask your science teachers about their research backgrounds
- Talk to older students who have done research
- Reach out to local college students

**Remember:**
- It's okay to change your mind
- Your interests will evolve as you learn more
- The best research often happens at the intersection of fields`,
  },
  {
    id: "what-to-expect",
    title: "What to Expect in a Research Lab",
    icon: "Building",
    content: `Starting in a research lab can feel overwhelming. Here's what to realistically expect:

**The First Few Weeks:**
- Lots of reading and training
- Learning lab protocols and safety procedures
- Observing experienced researchers
- Starting with small, simple tasks
- Feeling confused is completely normal

**Day-to-Day Life:**
- Research is not like school — there are no clear "right answers"
- Experiments often fail, and that's part of the process
- Progress is measured in weeks and months, not days
- You'll spend more time preparing and analyzing than actually running experiments

**Your Role:**
- You'll start as an assistant and gradually take on more responsibility
- Ask questions — researchers expect it
- Take detailed notes on everything
- Be patient with yourself

**What Success Looks Like:**
- Understanding the basics of your project
- Being able to independently perform assigned tasks
- Contributing meaningful observations
- Building relationships with lab members
- Learning skills you couldn't learn in a classroom`,
  },
];
