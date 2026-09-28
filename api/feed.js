export default async function handler(req,res){
const track=String(req.query.track||"1종");
const q=encodeURIComponent(`외환전문역 ${track} 기출 샘플 문제 시험`);
const url=`https://news.google.com/rss/search?q=${q}&hl=ko&gl=KR&ceid=KR:ko`;
try{
const r=await fetch(url,{headers:{"User-Agent":"Mozilla/5.0"}});
if(!r.ok)return res.status(502).json({items:[]});
const xml=await r.text();
const items=[...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0,20).map(m=>{
const x=m[1],get=t=>{const c=x.match(new RegExp(`<${t}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${t}>`));return c?c[1]:((x.match(new RegExp(`<${t}>([\\s\\S]*?)<\\/${t}>`))||[,""])[1])};
return{title:get("title").replace(/<[^>]*>/g,"").trim(),link:get("link").trim(),pubDate:get("pubDate").trim(),source:get("source").replace(/<[^>]*>/g,"").trim()}
});
return res.status(200).setHeader("Cache-Control","s-maxage=300, stale-while-revalidate=600").json({items})
}catch(e){return res.status(500).json({items:[]})}}