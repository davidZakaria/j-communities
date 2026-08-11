import type { ProjectThemeId } from "../../data/projects";
import type { ProjectSection } from "../../content/projects/types";
import { ProjectAmenities } from "./ProjectAmenities";
import { ProjectContactForm } from "./ProjectContactForm";
import { ProjectFloorPlans } from "./ProjectFloorPlans";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectGateway, ProjectSplit } from "./ProjectSplit";
import { ProjectHero } from "./ProjectHero";
import { ProjectMasterplan } from "./ProjectMasterplan";
import { ProjectPartners } from "./ProjectPartners";
import { ProjectPropertyTypes } from "./ProjectPropertyTypes";
import { ProjectStats } from "./ProjectStats";
import { ProjectTextBlock } from "./ProjectTextBlock";
import { ProjectTour3D } from "./ProjectTour3D";

interface ProjectSectionRendererProps {
  section: ProjectSection;
  projectName: string;
  projectSlug: string;
  themeId: ProjectThemeId;
}

export function ProjectSectionRenderer({ section, projectName, projectSlug, themeId }: ProjectSectionRendererProps) {
  switch (section.type) {
    case "hero":
      return <ProjectHero section={section} themeId={themeId} />;
    case "stats":
      return <ProjectStats section={section} />;
    case "text":
      return <ProjectTextBlock section={section} />;
    case "split":
      return <ProjectSplit section={section} />;
    case "gateway":
      return <ProjectGateway section={section} />;
    case "propertyTypes":
      return <ProjectPropertyTypes section={section} />;
    case "floorPlans":
      return <ProjectFloorPlans section={section} />;
    case "amenities":
      return <ProjectAmenities section={section} />;
    case "masterplan":
      return <ProjectMasterplan section={section} />;
    case "gallery":
      return <ProjectGallery section={section} />;
    case "tour3d":
      return <ProjectTour3D section={section} projectName={projectName} />;
    case "partners":
      return <ProjectPartners section={section} />;
    case "contact":
      return (
        <ProjectContactForm
          section={section}
          projectName={projectName}
          projectSlug={projectSlug}
          themeId={themeId}
        />
      );
    default:
      return null;
  }
}
