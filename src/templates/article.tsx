import React from "react";
import { graphql } from "gatsby";
import { SocialMediaLinksBlock } from "../components/blocks/socialmedialinks"
import YoutubeEmbed from "../components/video/YoutubeEmbed"
export default function ArticleTemplate({ data }) { 
  const soicialLinks = <SocialMediaLinksBlock node={data.blockContentSocialMedia} />
  let heroImageSection
  if(data.nodeArticle.relationships.field_hero_image != null) {
    const apiDomain = process.env.GATSBY_API_DOMAIN; 
    const image = apiDomain + data.nodeArticle.relationships.field_hero_image?.relationships?.field_media_image?.uri?.url;          
    heroImageSection = (
      <section className="pb-xlarge"> 
      <div className="hero-block__container" data-view-carousel="{&quot;width&quot;:&quot;1920&quot;,&quot;height&quot;:&quot;576&quot;}"> 
      <div className="hero-block__loading hero-block__loading--hidden" ></div> 
      <div className="hero-block__carousel"> <div className="hero-block__inner"> 
        <ul className="hero-block__slides"> 
          <li className="hero-block__slide"> 
            <div className="hero-block__slide-wrapper"> 
            <img className="hero-block__image" src={image} alt={data.nodeArticle.relationships?.field_hero_image?.image?.alt} /> 
            <div className="hero-block__overlay-container"> 
              <div className="hero-block__credit" dangerouslySetInnerHTML={{ __html: data.nodeArticle.relationships?.field_hero_image?.field_caption?.processed}} />
            </div> </div> 
          </li> 
        </ul> 
      </div> </div> 
      </div> </section> 
    )
  }
  let embedVideoSection
  if(data.nodeArticle.relationships.field_embed_video !=null && data.nodeArticle.relationships.field_embed_video.field_video_id != null) {
    const videoEmbedId = data.nodeArticle.relationships?.field_embed_video?.field_video_id;
    const videoTitle = data.nodeArticle.relationships?.field_embed_video?.field_video_title?.value;  
    embedVideoSection = <YoutubeEmbed embedId={videoEmbedId} videoTitle={videoTitle} />
  } 
  return (
    <>
    <div className="main-content" id="main-content" role="main"> 
      <section className="pt-large pb-small"> 
        <div className="grid-wrapper"> 
          <div className="grid-row clearfix"> 
            <div className="grid-col grid-col--12"> 
              <div className="page-header"> 
                <ul className="page-header__breadcrumbs clearfix"> 
                  <li className="page-header__breadcrumb"> <a href="/news/"> News </a> </li> 
                  <li className="page-header__breadcrumb"> 
                    <a href={data.nodeArticle.path.alias} 
                      dangerouslySetInnerHTML={{ __html:data.nodeArticle.field_article_title.value} } />              
                  </li> 
                </ul>             
                <div className="page-header__heading-wrapper clearfix">
                  <h1 className="page-header__heading" dangerouslySetInnerHTML={{ __html: data.nodeArticle.field_article_title.value }} />
                  <ul className="page-header__social-icons">
                    {soicialLinks}
                  </ul>
                </div>   
              </div> 
            </div> 
          </div> 
        </div> 
      </section> 
      {heroImageSection}
      <section className="pb-medium"> 
        <div className="grid-wrapper"> 
          <div className="grid-row clearfix"> 
            <div className="grid-col grid-col--8 grid-col--push-2 tb-grid-col--10 tb-grid-col--push-1 ph-grid-col--12 ph-grid-col--push-0"> 
            <div className="copy">
              {data.nodeArticle.body?.value ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: data.nodeArticle.body.value }}
                  />
                ) : (
                  ""
                )}
              {embedVideoSection} 
            </div>
          </div> 
        </div> 
        </div> 
      </section> 
        
    </div>
        </>
  );
}
export const query = graphql`
  query($drupalId: String!) {
    nodeArticle(drupal_id: { eq: $drupalId }) {
      body {
        value
      }
      field_article_title{
        value
      }
      path {
        alias
        pid
        langcode
      }	      
      relationships {
        field_hero_image {
          ...on media__hero_image {
            name
            width: field_width
            height: field_height
            image:field_media_image {
              alt
            }
            field_gradient_overlay
            field_caption {
              processed
            }
            relationships {
              field_media_image {
                uri {
                  url
                }
              }
            }
          }
        }
        field_embed_video{
          ...on paragraph__embed_video{
            field_video_id
            field_video_title {
              value
              format
              processed
            }
          }
        }        
      }
      field_publication_date 
      body {
        value
      }
    } 
    blockContentSocialMedia{
      ...SocialMediaLinksBlockQuery
    }   
  }
`;