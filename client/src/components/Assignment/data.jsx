export const courses = [
  { id: "ME101", name: "Engineering Mechanics", assignments: ["A1", "A2"] },
  { id: "CS101", name: "Introduction to Computing", assignments: ["A3", "A4"] },
  { id: "BT101", name: "Introduction to Biology", assignments: ["A5", "A6"] },
  { id: "CS201", name: "Discrete Mathematics", assignments: ["A7", "A8"] },
  { id: "AI101", name: "Artificial Intelligence", assignments: ["A9", "A10"] }
];

export const assignments = [
  {
    id: "A1",
    course_id: "ME101",
    title: "Mastering Newton's Laws of Motion",
    description: "Newton's Laws of Motion form the foundation of classical mechanics and govern the relationship between a body and the forces acting on it. In this assignment, you will explore all three laws in detail, using real-world examples and solving quantitative problems involving acceleration, net force, and inertia. Your goal is to demonstrate a strong conceptual understanding along with mathematical problem-solving skills.",
    due_date: "2025-04-10",
    submissions: [
      { student_id: "S101", student_name: "Alice Johnson", file_name: "alice_newton.pdf", submitted_at: "2025-04-08 14:30" },
      { student_id: "S102", student_name: "Bob Smith", file_name: "bob_newton.docx", submitted_at: "2025-04-09 16:45" }
    ]
  },
  {
    id: "A2",
    course_id: "ME101",
    title: "Comprehensive Free Body Diagrams",
    description: "Free Body Diagrams (FBDs) are essential tools for visualizing the forces acting on a body in a static or dynamic environment. In this task, you are required to draw FBDs for a variety of real-world engineering problems, identify unknown forces, and apply equilibrium equations to solve for these forces. Emphasis should be on clarity, accuracy, and systematic approach to problem-solving.",
    due_date: "2025-04-15",
    submissions: []
  },
  {
    id: "A3",
    course_id: "CS101",
    title: "Python Programming: Factorial Calculator",
    description: "This assignment focuses on the implementation of a recursive and an iterative solution to calculate the factorial of a number in Python. You'll be required to handle edge cases, validate user input, and analyze the time complexity of both approaches. Your solution should be well-documented and submitted as a script or Jupyter notebook.",
    due_date: "2025-04-08",
    submissions: [
      { student_id: "S103", student_name: "Charlie Brown", file_name: "charlie_factorial.py", submitted_at: "2025-04-07 10:20" }
    ]
  },
  {
    id: "A4",
    course_id: "CS101",
    title: "HTML & CSS Landing Page",
    description: "Design a responsive and visually appealing landing page using only HTML and CSS. You must include a header, a footer, navigation links, a call-to-action section, and use appropriate semantic tags. The final page should demonstrate clean layout principles, responsive design using media queries, and CSS best practices. Bonus for including simple animations or transitions.",
    due_date: "2025-04-20",
    submissions: []
  },
  {
    id: "A5",
    course_id: "BT101",
    title: "Cell Structure Analysis",
    description: "Prepare a detailed report that compares and contrasts prokaryotic and eukaryotic cell structures. Your submission should include labeled diagrams, explanations of each organelle’s function, and examples of organisms where these cell types are found. Reference at least two peer-reviewed articles and demonstrate a clear understanding of how cell structure affects function.",
    due_date: "2025-04-14",
    submissions: [
      { student_id: "S104", student_name: "Daisy Ridley", file_name: "cells_report.pdf", submitted_at: "2025-04-13 12:00" }
    ]
  },
  {
    id: "A6",
    course_id: "BT101",
    title: "DNA Structure Presentation",
    description: "Create a 6–10 slide presentation explaining the molecular structure of DNA, including its components, the double helix model, and the principles of base pairing. Include illustrations, historical background, and mention key contributors like Watson, Crick, and Rosalind Franklin. The presentation should be designed for a high school audience and include speaker notes.",
    due_date: "2025-04-22",
    submissions: []
  },
  {
    id: "A7",
    course_id: "CS201",
    title: "Set Theory Assignment",
    description: "Apply basic set theory to solve a collection of mathematical problems involving sets, subsets, Venn diagrams, and Cartesian products. Each problem should be solved with detailed steps, and all answers should be justified. You are also expected to write brief explanations of how these concepts are used in computing, especially in databases and algorithms.",
    due_date: "2025-04-09",
    submissions: [
      { student_id: "S105", student_name: "Ethan Hunt", file_name: "set_theory.pdf", submitted_at: "2025-04-08 11:15" }
    ]
  },
  {
    id: "A8",
    course_id: "CS201",
    title: "Graph Theory Worksheet",
    description: "This worksheet contains problems related to graph traversal (DFS and BFS), connected components, and graph coloring. You'll need to write both theoretical answers and code snippets (in any language) to illustrate traversal mechanisms. Real-world use cases of graphs in networking and social media analysis should also be briefly discussed.",
    due_date: "2025-04-18",
    submissions: []
  },
  {
    id: "A9",
    course_id: "AI101",
    title: "AI and Ethics Essay",
    description: "Write a 1500-word essay discussing ethical considerations in the development and deployment of artificial intelligence. Topics may include algorithmic bias, data privacy, job displacement, and the future of autonomous systems. Support your arguments with real-world examples and citations from at least three reputable sources.",
    due_date: "2025-04-12",
    submissions: [
      { student_id: "S106", student_name: "Fiona Gallagher", file_name: "ai_ethics.docx", submitted_at: "2025-04-11 17:00" }
    ]
  },
  {
    id: "A10",
    course_id: "AI101",
    title: "Intro to Machine Learning",
    description: "Train a simple linear regression model using any programming language or ML framework (Python + scikit-learn recommended). You'll use a dataset of your choice to predict a continuous variable. Explain your preprocessing, training, testing, and evaluation steps. Submit your code, plots, and a report summarizing your model's performance and accuracy.",
    due_date: "2025-04-25",
    submissions: []
  }
];
