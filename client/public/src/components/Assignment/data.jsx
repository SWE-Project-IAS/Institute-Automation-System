export const courses = [
  {
    id: "ME101",
    name: "Engineering Mechanics",
    assignments: [
      { 
        id: "A1", 
        title: "Mastering Newton's Laws of Motion", 
        description: "Newton's Laws of Motion form the foundation of classical mechanics. In this assignment, you will solve a variety of physics problems involving Newton's three laws. You must apply the principles of force, mass, and acceleration to analyze real-world mechanical systems. The problems include determining net forces, calculating acceleration in different scenarios, and solving for unknown variables using Newton's equations. Submit a detailed report with free-body diagrams, step-by-step solutions, and justifications for each answer. Clearly label all forces and explain reasoning behind each calculation.", 
        due_date: "2025-04-10" 
      },
      { 
        id: "A2", 
        title: "Comprehensive Free Body Diagrams", 
        description: "A free-body diagram is a graphical representation used to visualize the forces acting upon an object. For this assignment, you will analyze multiple mechanical systems, including pulleys, inclined planes, and connected bodies. Your task is to carefully draw accurate free-body diagrams for each given system, labeling all forces such as tension, normal force, friction, and applied forces. Additionally, you will explain the significance of each force and how they contribute to the system’s equilibrium. The submission should include a written explanation of the force interactions and corresponding equilibrium equations.", 
        due_date: "2025-04-15" 
      }
    ]
  },
  {
    id: "CS101",
    name: "Introduction to Computing",
    assignments: [
      { 
        id: "A1", 
        title: "Python Programming: Factorial Calculator", 
        description: "Factorial computation is a fundamental concept in programming and is commonly used in permutations, combinations, and recursive algorithms. In this assignment, you will write a Python program that computes the factorial of a given number using both iterative and recursive approaches. Analyze the efficiency of each method by comparing their execution time for large input values. Implement error handling for invalid inputs and include test cases demonstrating the correctness of your program.", 
        due_date: "2025-04-08" 
      },
      { 
        id: "A2", 
        title: "Linked List Implementation", 
        description: "Linked lists are a fundamental data structure in computer science. Your task is to implement a singly linked list in JavaScript with functionalities for inserting, deleting, and traversing nodes. The implementation should include methods for adding a node at the beginning, at the end, and at a specific position. You should also implement a function to reverse the linked list and a function to detect cycles using Floyd’s Cycle Detection Algorithm. Submit a report explaining the advantages of linked lists over arrays, the time complexity of each operation, and real-world applications.", 
        due_date: "2025-04-12" 
      }
    ]
  },
  {
    id: "BT101",
    name: "Introduction to Biology",
    assignments: [
      { 
        id: "A1", 
        title: "Understanding Cell Structure", 
        description: "Cells are the building blocks of life. In this assignment, you will create detailed diagrams of prokaryotic and eukaryotic cells, labeling all organelles and explaining their functions. Additionally, you will write a comparative analysis discussing the differences between plant and animal cells, emphasizing structural and functional distinctions. Your submission should include hand-drawn or digital illustrations along with a detailed report discussing the role of each organelle in maintaining cellular function.", 
        due_date: "2025-04-09" 
      },
      { 
        id: "A2", 
        title: "Exploring Mendelian Genetics", 
        description: "Gregor Mendel's experiments laid the foundation for modern genetics. In this assignment, you will analyze different genetic crosses using Punnett squares to predict the inheritance of traits. You must explain dominant and recessive alleles, genotype and phenotype ratios, and real-world applications of genetic inheritance, such as genetic disorders and selective breeding. Your report should include well-illustrated diagrams, problem-solving examples, and a discussion on the impact of genetics in medicine and biotechnology.", 
        due_date: "2025-04-14" 
      }
    ]
  },
  {
    id: "CS201",
    name: "Discrete Mathematics",
    assignments: [
      { 
        id: "A1", 
        title: "Set Theory and its Applications", 
        description: "Set theory is a fundamental concept in discrete mathematics. In this assignment, you will solve problems involving set operations such as union, intersection, and complement. You must also demonstrate how Venn diagrams are used to visualize these operations. Additionally, research and discuss real-world applications of set theory in database systems, artificial intelligence, and probability theory. Submit a report with problem solutions, graphical representations, and real-life examples.", 
        due_date: "2025-04-07" 
      },
      { 
        id: "A2", 
        title: "Graph Theory Fundamentals", 
        description: "Graph theory has numerous applications in computer science, from network design to social media analytics. In this assignment, you will study different types of graphs, such as directed, undirected, weighted, and unweighted graphs. Implement an adjacency list and matrix representation of graphs and use algorithms like Dijkstra’s and Kruskal’s to solve pathfinding problems. Your submission should include working code, test cases, and a report analyzing algorithm efficiency and real-world applications.", 
        due_date: "2025-04-13" 
      }
    ]
  },
  {
    id: "AI101",
    name: "Artificial Intelligence",
    assignments: [
      { 
        id: "A1", 
        title: "Exploring Search Algorithms: BFS vs. DFS", 
        description: "Search algorithms play a crucial role in artificial intelligence, especially in pathfinding and decision-making systems. In this assignment, you will implement Breadth-First Search (BFS) and Depth-First Search (DFS) algorithms in Python to traverse a graph. Test your implementations on a sample dataset and analyze their time and space complexity. Additionally, submit a report comparing the strengths and weaknesses of BFS and DFS and their real-world applications, such as web crawling and route optimization.", 
        due_date: "2025-04-05" 
      },
      { 
        id: "A2", 
        title: "Building a Simple Neural Network", 
        description: "Neural networks are the foundation of deep learning. In this assignment, you will build a simple feedforward neural network using TensorFlow and train it to recognize handwritten digits using the MNIST dataset. Your submission should include a well-documented Python script that defines the network architecture, implements forward and backward propagation, and visualizes training performance. Additionally, write a report explaining key concepts such as activation functions, gradient descent, and backpropagation.", 
        due_date: "2025-04-15" 
      }
    ]
  }
];
