import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ProjectsContainer = styled.div`
  padding: 2rem;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProjectCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProjectTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.25rem;
`;

// Örnek proje verileri - Gerçek uygulamada API'den gelecek
const projects = [
  { id: 1, title: 'Proje 1' },
  { id: 2, title: 'Proje 2' },
  { id: 3, title: 'Proje 3' },
  { id: 4, title: 'Proje 4' },
];

const Projects: React.FC = () => {
  const navigate = useNavigate();

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <ProjectsContainer>
      <h1>Projeler</h1>
      <ProjectsGrid>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            onClick={() => handleProjectClick(project.id)}
          >
            <ProjectTitle>{project.title}</ProjectTitle>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </ProjectsContainer>
  );
};

export default Projects; 