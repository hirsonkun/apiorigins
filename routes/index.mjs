import { Router } from "express";
const router = Router();
import fetch from "node-fetch";
import * as cheerio from "cheerio";

/* GET home page. */
router.get("/", async function (req, res) {
  try {
    const url = req.query.url;
    if (url) {
      const response = fetch(decodeURIComponent(url));
      const data = await (await response).text();
      return res.render("result", { data });
    }
  } catch (e) {
    return res.render("result", { data: e.message });
  }
  return res.render("index", { title: "Express" });
});
router.get("/raw", async function (req, res) {
  try {
    const url = req.query.url;
    if (url) {
      const response = fetch(decodeURIComponent(url));
      const data = await (await response).text();
      return res.json({ data });
    }
  } catch (e) {
    return res.json({ data: null, message: e.message });
  }
  return res.json({ data: null, message: "Hello World" });
});
router.get("/line", async function (req, res) {
  let results = [];
  try {
    const url = req.query.url;
    if (url) {
      const response = fetch(decodeURIComponent(url));
      const data = await (await response).text();
      const $ = cheerio.load(data);
      const json = JSON.parse($("script#__NEXT_DATA__").html() || "{}");
      const feeds = Object.values(json.props?.pageProps?.initialState?.api?.feeds || {});
      /* feeds.forEach(({ post }) => {
        let media = post?.contents?.media;
        Array.isArray(media) &&
          media.forEach(({ type, resourceId }) => {
            type == "VIDEO"
              ? results.push(
                  `<video width="320" height="240" controls><source src="https://obs.line-scdn.net/${resourceId}" type="video/mp4"></video>`
                )
              : results.push(`<img src="https://obs.line-scdn.net/${resourceId}" width="320" height="240">`);
          });
      }); */
      // Use clasical loop for better performance
      for (let i = 0, fLength = feeds.length; i < fLength; i++) {
        let media = feeds[i].post?.contents?.media;
        if (Array.isArray(media)) {
          for (let j = 0, mLength = media.length; j < mLength; j++) {
            let { type, resourceId } = media[j];
            let push =
              type === "VIDEO"
                ? `<video width="320" height="240" controls><source src="https://obs.line-scdn.net/${resourceId}" type="video/mp4"></video>`
                : `<img src="https://obs.line-scdn.net/${resourceId}" width="320" height="240">`;
            results.push(push);
          }
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
router.get("/raw/line", async function (req, res) {
  let results = [],
    errMsg = { src: null, type: null, message: "" };
  try {
    const url = req.query.url;
    if (url) {
      const response = fetch(decodeURIComponent(url));
      const data = await (await response).text();
      const $ = cheerio.load(data);
      const json = JSON.parse($("script#__NEXT_DATA__").html() || "{}");
      const feeds = Object.values(json.props?.pageProps?.initialState?.api?.feeds || {});
      // feeds.forEach(({ post }) => {
      //   let media = post?.contents?.media;
      //   if (Array.isArray(media)) {
      //     media.forEach(({ type, resourceId }) => {
      //       results.push({ src: `https://obs.line-scdn.net/${resourceId}`, type: type?.toString().toLowerCase() || "" });
      //     });
      //   }
      // });
      // Use clasical loop for better performance
      for (let i = 0, fLength = feeds.length; i < fLength; i++) {
        let media = feeds[i].post?.contents?.media;
        if (Array.isArray(media)) {
          for (let j = 0, mLength = media.length; j < mLength; j++) {
            let { type, resourceId } = media[j];
            results.push({ src: `https://obs.line-scdn.net/${resourceId}`, type });
          }
        }
      }
      if (!results.length) {
        errMsg.message = "Invalid Link";
        results.push(errMsg);
      }
      return results;
    }
    errMsg.message = "Insert URL\nExample: /raw/line?url=https://timeline.line.me/post/1162777602901016295";
    results.push(errMsg);
    return results;
  } catch (e) {
    errMsg.message = e.message;
    results.push(errMsg);
    return results;
  } finally {
    return res.json({ result: results });
  }
});
router.get("/file", async function (req, res) {
  const errMsg = "Tidak dapat menemukan id stiker/tema.";
  try {
    const url = req.query.url;
    if (url) {
      const response = await fetch(decodeURIComponent(url));
      if (response.ok && response.headers.get("Content-Type") === "application/zip") {
        const data = await response.arrayBuffer();
        const files = Buffer.from(data).toString("base64");
        res.set("X-Downloaded-Size", files.length);
        return res.send(files);
      }
    }
    res.set("X-Custom-Response", errMsg);
    return res.send(errMsg);
  } catch (error) {
    res.set("X-Custom-Response", errMsg);
    return res.send(errMsg);
  }
});

export default router;
