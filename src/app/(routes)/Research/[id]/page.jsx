"use client";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { fetchData } from "@/utils/fetchData";
import ResearchHero from "../_components/ResearchHero/ResearchHero";
import Theme from "../_components/Theme";
import Content from "../_components/Content";
import ResearchMembers from "../_components/ResearchMembersSection";
import ResearchPapers from "../_components/ResearchPapers";
import Breadcrumbs from "../_components/Breadcrumbs";
import img from "../assests/HeroImg/bg2.png";
import LoadingSpinner from "@/components/LoadingSpinner";

const ResearchItem = ({ params }) => {
  const { id } = params;
  const [researchItem, setResearchItem] = useState(null);
  const [contentImages, setContentImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResearchItem = async () => {
      try {
        const data = await fetchData(
          `/api/research-sections/${id}?populate=*`
        );

        const imageData = await fetchData(
          `/api/research-sections/${id}?populate[0]=ReasearchContent.Image&populate[1]=AimAndSummary.Image`
        );

        const researchContentImages = imageData.data.attributes.ReasearchContent.map(
          (content) => content.Image?.data?.attributes || null
        );

        setResearchItem(data.data);
        setContentImages(researchContentImages);
      } catch (error) {
        console.error("Error fetching research data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchItem();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!researchItem) {
    return notFound();
  }

  const {
    ResearchTitle,
    ResearchSubTitle,
    Description,
    Thumbnail,
    Themes,
    Members,
    PapersPublished,
    ReasearchContent,
  } = researchItem.attributes;

  const thumbnailImage = Thumbnail?.data?.attributes?.formats?.large?.url || img;

  return (
    <div className="bg-gray-50 min-h-screen">
      <ResearchHero
        title={ResearchTitle}
        subtitle={ResearchSubTitle}
        imageUrl={thumbnailImage}
      />

      <Breadcrumbs />

      <Theme
        themes={Themes?.map((theme) => theme.Theme) || []}
        heading={Description}
      />

      {ReasearchContent && ReasearchContent.length > 0 && (
        <Content
          link={ReasearchContent[0]?.Link}
          text={ReasearchContent[0]?.ReasearchContent}
          imageUrl={contentImages[0]?.url || thumbnailImage}
          thumbnailImage={thumbnailImage}
        />
      )}

      <ResearchPapers papers={PapersPublished || []} />

      <ResearchMembers membersList={Members?.map((member) => member.Members) || []} />
    </div>
  );
};

export default ResearchItem;