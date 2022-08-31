import { Router } from "express";
const router = Router();
// import fetch from "node-fetch";
import cheerio from "cheerio";
import browser from "puppeteer";
// import fs from "fs";
router.get("/raw/instagram", async (req, res, next) => {
  let results = [],
    owner = null;
  try {
    const url = req.query.url;
    if (url) {
      if (!global.browser) {
        global.browser = await browser.launch({
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
      }
      const newContext = await global.browser.createIncognitoBrowserContext();
      const page = await newContext.newPage();
      await page.goto(decodeURIComponent(url));
      const data = await page.content();
      await newContext.close();
      // const data = await (await response).text();
      const $ = cheerio.load(data);
      const tes = $("script").contents();
      //   console.log(tes[0].data);
      for (const s of tes) {
        try {
          const cv = s.data.replaceAll(/window._sharedData = |;/gi, "").toString();
          const resource = JSON.parse(cv);
          if (typeof resource === "object") {
            const { PostPage, ProfilePage } = resource.entry_data;
            if (PostPage) {
              for (const { graphql } of PostPage) {
                const post = graphql?.shortcode_media;
                if (post) {
                  const {
                    __typename,
                    id,
                    shortcode,
                    dimensions,
                    gating_info,
                    fact_check_overall_rating,
                    fact_check_information,
                    sensitivity_friction_info,
                    sharing_friction_info,
                    media_overlay_info,
                    media_preview,
                    display_url,
                    display_resources,
                    accessibility_caption,
                    dash_info,
                    has_audio,
                    video_url,
                    video_view_count,
                    video_play_count,
                    is_video,
                    tracking_token,
                    upcoming_event,
                    edge_media_to_tagged_user,
                  } = post;
                  switch (post.__typename?.toLowerCase()) {
                    case "graphsidecar": {
                      const getArray = post.edge_sidecar_to_children?.edges;
                      for (const { node } of getArray) {
                        if (node) {
                          results.push(node);
                        }
                      }
                      break;
                    }
                    case "graphvideo": {
                      results.push({
                        __typename,
                        id,
                        shortcode,
                        dimensions,
                        gating_info,
                        fact_check_overall_rating,
                        fact_check_information,
                        sensitivity_friction_info,
                        sharing_friction_info,
                        media_overlay_info,
                        media_preview,
                        display_url,
                        display_resources,
                        accessibility_caption,
                        dash_info,
                        has_audio,
                        video_url,
                        video_view_count,
                        video_play_count,
                        is_video,
                        tracking_token,
                        upcoming_event,
                        edge_media_to_tagged_user,
                      });
                      break;
                    }
                    case "graphimage": {
                      results.push({
                        __typename,
                        id,
                        shortcode,
                        dimensions,
                        gating_info,
                        fact_check_overall_rating,
                        fact_check_information,
                        sensitivity_friction_info,
                        sharing_friction_info,
                        media_overlay_info,
                        media_preview,
                        display_url,
                        display_resources,
                        accessibility_caption,
                        is_video,
                        tracking_token,
                        upcoming_event,
                        edge_media_to_tagged_user,
                      });
                      break;
                    }
                  }
                }
              }
            } else if (ProfilePage) {
              for (const { graphql } of ProfilePage) {
                const post = graphql?.user;
                if (post) {
                  const { edge_felix_video_timeline, edge_owner_to_timeline_media } = post;
                  if (edge_felix_video_timeline?.edges) {
                    for (const { node } of edge_felix_video_timeline.edges) {
                      results.push(node);
                    }
                  }
                  if (edge_owner_to_timeline_media?.edges) {
                    for (const { node } of edge_owner_to_timeline_media.edges) {
                      results.push(node);
                    }
                  }
                }
              }
            }
          }
        } catch {
          continue;
        }
      }
      return results;
    }
    results = "<p>Insert URL</p><p>Example: /line?url=https://timeline.line.me/post/1162777602901016295</p>";
    return results;
  } catch (e) {
    results = `<p>${e.message}</p>`;
    return results;
  } finally {
    return res.json({ results });
  }
});
/* router.get("/instagram", async (req, res, next) => {
  let results = [],
    owner = null;
  try {
    const url = req.query.url;
    if (url) {
      const response = fetch(decodeURIComponent(url));
      const data = await (await response).text();
      const $ = cheerio.load(data);
      const tes = $("script").contents();
      //   console.log(tes[0].data);
      for (const s of tes) {
        try {
          const cv = s.data.replaceAll(/window._sharedData = |;/gi, "").toString();
          const resource = JSON.parse(cv);
          if (typeof resource === "object") {
            const { PostPage, ProfilePage } = resource.entry_data;
            if (PostPage) {
              for (const { graphql } of PostPage) {
                const post = graphql?.shortcode_media;
                if (post) {
                  const {
                    __typename,
                    id,
                    shortcode,
                    dimensions,
                    gating_info,
                    fact_check_overall_rating,
                    fact_check_information,
                    sensitivity_friction_info,
                    sharing_friction_info,
                    media_overlay_info,
                    media_preview,
                    display_url,
                    display_resources,
                    accessibility_caption,
                    dash_info,
                    has_audio,
                    video_url,
                    video_view_count,
                    video_play_count,
                    is_video,
                    tracking_token,
                    upcoming_event,
                    edge_media_to_tagged_user,
                  } = post;
                  switch (post.__typename?.toLowerCase()) {
                    case "graphsidecar": {
                      const getArray = post.edge_sidecar_to_children?.edges;
                      for (const { node } of getArray) {
                        if (node) {
                          results.push(node);
                        }
                      }
                      break;
                    }
                    case "graphvideo": {
                      results.push({
                        __typename,
                        id,
                        shortcode,
                        dimensions,
                        gating_info,
                        fact_check_overall_rating,
                        fact_check_information,
                        sensitivity_friction_info,
                        sharing_friction_info,
                        media_overlay_info,
                        media_preview,
                        display_url,
                        display_resources,
                        accessibility_caption,
                        dash_info,
                        has_audio,
                        video_url,
                        video_view_count,
                        video_play_count,
                        is_video,
                        tracking_token,
                        upcoming_event,
                        edge_media_to_tagged_user,
                      });
                      break;
                    }
                    case "graphimage": {
                      results.push({
                        __typename,
                        id,
                        shortcode,
                        dimensions,
                        gating_info,
                        fact_check_overall_rating,
                        fact_check_information,
                        sensitivity_friction_info,
                        sharing_friction_info,
                        media_overlay_info,
                        media_preview,
                        display_url,
                        display_resources,
                        accessibility_caption,
                        is_video,
                        tracking_token,
                        upcoming_event,
                        edge_media_to_tagged_user,
                      });
                      break;
                    }
                  }
                }
              }
            } else if (ProfilePage) {
              for (const { graphql } of ProfilePage) {
                const post = graphql?.user;
                if (post) {
                  if (!fs.existsSync(`./${post.full_name}`)) {
                    fs.mkdirSync(`./${post.full_name}`);
                  }
                  const { edge_felix_video_timeline, edge_owner_to_timeline_media } = post;
                  if (edge_felix_video_timeline?.edges) {
                    for (const { node } of edge_felix_video_timeline.edges) {
                      let filename = `./${post.full_name}/${post.full_name}-${Date.now()}`;
                      if (node.is_video) {
                        // fs.writeFileSync(filename + ".mp4", node.video_url);
                        await writeStream(filename + ".mp4", node.video_url);
                      } else {
                        // fs.writeFileSync(filename + ".jpg", node.display_url);
                        await writeStream(filename + ".jpg", node.display_url);
                      }
                      //   node.is_video ? results.push(`<video controls><source src=${node.video_url}" type="video/mp4"></video>`) : results.push(`<img src="${node.display_url}">`);
                    }
                  }
                  if (edge_owner_to_timeline_media?.edges) {
                    for (const { node } of edge_owner_to_timeline_media.edges) {
                      let filename = `./${post.full_name}/${post.full_name}-${Date.now()}`;
                      if (node.is_video) {
                        // fs.writeFileSync(filename + ".mp4", node.video_url);
                        await writeStream(filename + ".mp4", node.video_url);
                      } else {
                        // fs.writeFileSync(filename + ".jpg", node.display_url);
                        await writeStream(filename + ".jpg", node.display_url);
                      }

                      //   node.is_video ? results.push(`<video controls><source src="${node.video_url}" type="video/mp4"></video>`) : results.push(`<img src="${node.display_url}">`);
                    }
                  }
                }
              }
            }
          }
        } catch {
          continue;
        }
      }
      results = results.join("").trim() || "<p>Invalid Link</p>";
      return results;
    }
    results = "<p>Insert URL</p><p>Example: /line?url=https://timeline.line.me/post/1162777602901016295</p>";
    return results;
  } catch (e) {
    results = `<p>${e.message}</p>`;
    return results;
  } finally {
    return res.render("result", { data: results });
  }
});
import http from "https";
const writeStream = async (filename, url) => {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      // Image will be stored at this path
      const filePath = fs.createWriteStream(filename);
      res.pipe(filePath);
      filePath.on("finish", () => {
        filePath.close();
        console.log("Download Completed");
        setTimeout(() => {
          return resolve(1);
        }, 5000);
      });
    });
  });
}; */
export default router;
