import { Accordion } from '@mantine/core';


const faqData = [
  {
    question: 'What is Autohero?',
    answer: 'Autohero is a blockchain-based game developed for the Solana Hackathon. It allows players to create and customize their heroes, who then grow and evolve automatically over time. Players can interact with their heroes by participating in events, gaining rewards, and making strategic decisions to influence their growth.',
  },
  {
    question: 'How does the automatic growth system work?',
    answer: 'Your hero grows and evolves even when you\'re not actively playing. The game simulates a continuous journey of development, where heroes gain experience, skills, and items based on time and participation in various events.',
  },
  {
    question: 'Can I play Autohero for free?',
    answer: 'Yes, Autohero is designed to be accessible to everyone. While certain premium features or items may be available for purchase, players can experience the core gameplay without spending money.',
  },
];

export function FaqPage() {
  return (
    <div>
      <h2>F.A.Q.</h2>
      <Accordion>
        {faqData.map(({ question, answer }, index) => (
          <Accordion.Item key={index} value={question}>
            <Accordion.Control>
              {question}
            </Accordion.Control>
            <Accordion.Panel>{answer}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}