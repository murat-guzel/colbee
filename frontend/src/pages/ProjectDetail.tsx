import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const ProjectDetailContainer = styled.div`
  padding: 2rem;
`;

const ProjectHeader = styled.div`
  margin-bottom: 2rem;
`;

const ProjectTitle = styled.h1`
  margin: 0;
  color: #333;
`;

const ProjectContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Örnek proje verisi - Gerçek uygulamada API'den gelecek
  const project = {
    id: Number(id),
    title: `Proje ${id}`,
    description: 'Bu proje hakkında detaylı bilgiler burada yer alacak.',
  };

  return (
    <ProjectDetailContainer>
      <ProjectHeader>
        <ProjectTitle>{project.title}</ProjectTitle>
      </ProjectHeader>
      <ProjectContent>
        <p>{project.description}</p>
      </ProjectContent>
    </ProjectDetailContainer>
  );
};

export default ProjectDetail; 