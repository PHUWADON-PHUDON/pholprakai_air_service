import axiosCore from "@/lib/axiosCore";

type TikTokOEmbed = { html: string };

export async function getTikTokEmbed(url: string): Promise<string> {
  const response = await axiosCore.get<TikTokOEmbed>("https://www.tiktok.com/oembed", {
    params: { url },
  });
  return response.data.html;
}
