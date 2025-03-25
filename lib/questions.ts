// Sample questions for the game
// In a real implementation, you might want to store these in a database

export const questions = {
  phase1: [
    {
      id: 1,
      subject: "mathematics",
      text: "To calculate the correct trajectory of your spaceship, you need to understand angles. If the launch pad forms a 45° angle with the ground, and the spaceship reaches a height of 200 meters, what is the horizontal distance covered?",
      options: [
        { id: "a", text: "100 meters", isCorrect: false },
        { id: "b", text: "200 meters", isCorrect: true },
        { id: "c", text: "300 meters", isCorrect: false },
        { id: "d", text: "400 meters", isCorrect: false },
      ],
      explanation: "At a 45° angle, the tangent equals 1. So the horizontal distance is 200 m / tan(45°) = 200 m.",
    },
    {
      id: 2,
      subject: "physics",
      text: "A spaceship accelerates at 10 m/s². If it takes 5 seconds to lift off, what is its velocity at that moment?",
      options: [
        { id: "a", text: "10 m/s", isCorrect: false },
        { id: "b", text: "25 m/s", isCorrect: false },
        { id: "c", text: "50 m/s", isCorrect: true },
        { id: "d", text: "100 m/s", isCorrect: false },
      ],
      explanation: "Using the equation v = a × t, we get v = 10 m/s² × 5 s = 50 m/s.",
    },
    {
      id: 3,
      subject: "physics",
      text: "To escape Earth's gravity, you must reach the escape velocity of 11.2 km/s. If a small rocket reaches only 5.6 km/s, what percentage of the escape velocity has it achieved?",
      options: [
        { id: "a", text: "25%", isCorrect: false },
        { id: "b", text: "50%", isCorrect: true },
        { id: "c", text: "75%", isCorrect: false },
        { id: "d", text: "90%", isCorrect: false },
      ],
      explanation: "The percentage is (5.6 km/s ÷ 11.2 km/s) × 100% = 50%.",
    },
    {
      id: 4,
      subject: "chemistry",
      text: "Your spaceship needs a lightweight but strong material. Which element is best for building the outer shell?",
      options: [
        { id: "a", text: "Iron", isCorrect: false },
        { id: "b", text: "Titanium", isCorrect: true },
        { id: "c", text: "Copper", isCorrect: false },
        { id: "d", text: "Lead", isCorrect: false },
      ],
      explanation: "Titanium has an excellent strength-to-weight ratio, making it ideal for spacecraft construction.",
    },
    {
      id: 5,
      subject: "chemistry",
      text: "To generate thrust, rockets burn liquid hydrogen and liquid oxygen. What chemical reaction occurs?",
      options: [
        { id: "a", text: "H₂ + O₂ → H₂O₂", isCorrect: false },
        { id: "b", text: "2H₂ + O₂ → 2H₂O + Energy", isCorrect: true },
        { id: "c", text: "H₂ + O → H₂O", isCorrect: false },
        { id: "d", text: "2H + O₂ → H₂O₂", isCorrect: false },
      ],
      explanation:
        "The combustion of hydrogen with oxygen produces water and releases a large amount of energy: 2H₂ + O₂ → 2H₂O + Energy.",
    },
    {
      id: 6,
      subject: "biology",
      text: "Astronauts need oxygen to survive. Which of these is a primary oxygen source in a spaceship?",
      options: [
        { id: "a", text: "Compressed air tanks", isCorrect: false },
        { id: "b", text: "Algae-based oxygen generators", isCorrect: false },
        { id: "c", text: "Both A and B", isCorrect: true },
        { id: "d", text: "Neither A nor B", isCorrect: false },
      ],
      explanation:
        "Modern spacecraft use both compressed oxygen tanks for short-term supply and biological systems like algae for long-term oxygen generation.",
    },
    {
      id: 7,
      subject: "biology",
      text: "Microgravity affects astronauts' bones. What happens if they don't exercise in space?",
      options: [
        { id: "a", text: "Bone density increases", isCorrect: false },
        { id: "b", text: "Bone density decreases", isCorrect: true },
        { id: "c", text: "Bones become more flexible", isCorrect: false },
        { id: "d", text: "No change to bones", isCorrect: false },
      ],
      explanation:
        "In microgravity, bones don't have to support body weight, leading to decreased bone density (osteopenia) if astronauts don't exercise regularly.",
    },
    {
      id: 8,
      subject: "coding",
      text: "Your spaceship's AI system needs a conditional statement to detect engine failure. How would you write this in Python?",
      options: [
        { id: "a", text: "if engine_status = 'failure': print('Abort mission!')", isCorrect: false },
        { id: "b", text: "if engine_status == 'failure': print('Abort mission!')", isCorrect: true },
        { id: "c", text: "if (engine_status = failure) { print('Abort mission!') }", isCorrect: false },
        { id: "d", text: "if engine_status is failure then print('Abort mission!')", isCorrect: false },
      ],
      explanation:
        "In Python, the correct syntax for a conditional statement uses double equals (==) for comparison and a colon (:) to begin the conditional block.",
    },
    {
      id: 9,
      subject: "mathematics",
      text: "If your spaceship travels at 20,000 km/h, how long will it take to reach the Moon, which is approximately 384,400 km away?",
      options: [
        { id: "a", text: "About 19.2 hours", isCorrect: true },
        { id: "b", text: "About 38.4 hours", isCorrect: false },
        { id: "c", text: "About 9.6 hours", isCorrect: false },
        { id: "d", text: "About 48 hours", isCorrect: false },
      ],
      explanation: "Time = Distance ÷ Speed = 384,400 km ÷ 20,000 km/h = 19.22 hours, or about 19.2 hours.",
    },
  ],
  phase2: [
    {
      id: 1,
      subject: "chemistry",
      text: "Your spaceship needs a strong but lightweight frame. Which element should you mine?",
      options: [
        { id: "a", text: "Aluminum", isCorrect: true },
        { id: "b", text: "Lead", isCorrect: false },
        { id: "c", text: "Gold", isCorrect: false },
        { id: "d", text: "Iron", isCorrect: false },
      ],
      explanation: "Aluminum has a high strength-to-weight ratio, making it ideal for spacecraft construction.",
    },
    {
      id: 2,
      subject: "physics",
      text: "To withstand space radiation, which coating material is best?",
      options: [
        { id: "a", text: "Lead", isCorrect: false },
        { id: "b", text: "Graphene", isCorrect: true },
        { id: "c", text: "Plastic", isCorrect: false },
        { id: "d", text: "Glass", isCorrect: false },
      ],
      explanation: "Graphene provides excellent radiation shielding while being extremely lightweight.",
    },
    {
      id: 3,
      subject: "chemistry",
      text: "You need to create liquid hydrogen for rocket fuel. At what temperature does hydrogen liquefy?",
      options: [
        { id: "a", text: "-153°C", isCorrect: false },
        { id: "b", text: "-253°C", isCorrect: true },
        { id: "c", text: "-73°C", isCorrect: false },
        { id: "d", text: "-353°C", isCorrect: false },
      ],
      explanation:
        "Hydrogen liquefies at approximately -253°C (20 K), which requires advanced cryogenic cooling systems.",
    },
    {
      id: 4,
      subject: "chemistry",
      text: "You have 10 liters of liquid oxygen and 20 liters of liquid hydrogen. What ratio do you mix them for optimal combustion?",
      options: [
        { id: "a", text: "1:1", isCorrect: false },
        { id: "b", text: "1:2", isCorrect: true },
        { id: "c", text: "2:1", isCorrect: false },
        { id: "d", text: "3:1", isCorrect: false },
      ],
      explanation:
        "The optimal ratio for hydrogen-oxygen combustion is 2 parts hydrogen to 1 part oxygen (by volume), which matches the chemical equation 2H₂ + O₂ → 2H₂O.",
    },
    {
      id: 5,
      subject: "physics",
      text: "What shape should the spaceship's nose be to reduce air resistance?",
      options: [
        { id: "a", text: "Flat", isCorrect: false },
        { id: "b", text: "Cone-shaped", isCorrect: true },
        { id: "c", text: "Cube", isCorrect: false },
        { id: "d", text: "Sphere", isCorrect: false },
      ],
      explanation:
        "A cone-shaped nose creates less drag by allowing air to flow smoothly around the spacecraft during launch through the atmosphere.",
    },
    {
      id: 6,
      subject: "physics",
      text: "Newton's Third Law states: 'For every action, there is an equal and opposite reaction.' How does this apply to rocket thrust?",
      options: [
        { id: "a", text: "Burning fuel pushes gases down, and the rocket moves up", isCorrect: true },
        { id: "b", text: "The rocket pushes against the launch pad", isCorrect: false },
        { id: "c", text: "Air resistance pushes the rocket upward", isCorrect: false },
        { id: "d", text: "Gravity pulls the rocket down, so the rocket must push up", isCorrect: false },
      ],
      explanation:
        "Rockets work by expelling hot gases downward at high speed (action), which creates an equal and opposite force pushing the rocket upward (reaction).",
    },
    {
      id: 7,
      subject: "coding",
      text: "You need to program your spaceship's navigation system. What type of AI is best?",
      options: [
        { id: "a", text: "Rule-based system", isCorrect: false },
        { id: "b", text: "Supervised learning", isCorrect: false },
        { id: "c", text: "Reinforcement learning", isCorrect: true },
        { id: "d", text: "Unsupervised learning", isCorrect: false },
      ],
      explanation:
        "Reinforcement learning is ideal for navigation systems as it can learn optimal trajectories through trial and error, adapting to changing conditions in space.",
    },
    {
      id: 8,
      subject: "coding",
      text: "Which of the following Python functions correctly monitors oxygen levels in the spaceship?",
      options: [
        {
          id: "a",
          text: "def check_oxygen(level):\n  if level < 20:\n    return 'Warning! Oxygen low!'\n  else:\n    return 'Oxygen levels stable.'",
          isCorrect: true,
        },
        {
          id: "b",
          text: "function check_oxygen(level) {\n  if (level < 20) {\n    return 'Warning! Oxygen low!'\n  } else {\n    return 'Oxygen levels stable.'\n  }\n}",
          isCorrect: false,
        },
        {
          id: "c",
          text: "def check_oxygen(level):\n  if level < 20\n    print('Warning! Oxygen low!')\n  else\n    print('Oxygen levels stable.')",
          isCorrect: false,
        },
        { id: "d", text: "check_oxygen = lambda: 'Warning!' if oxygen < 20", isCorrect: false },
      ],
      explanation:
        "Option A shows the correct Python syntax for a function that checks oxygen levels, using proper indentation, colons, and return statements.",
    },
  ],
}

