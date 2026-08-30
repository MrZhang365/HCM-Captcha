export interface Question {
    tag: string,
    text: string,
}

export interface SelectedQuestion {
    imgId: number,
    text: string,
    answer: number[],
}

export const MIN_IMG = 0
export const MAX_IMG = 23
export const QUESTIONS = [
    { tag: "general", text: "请点击所有包含<b>朝鲜车厢</b>的图片块" },
    { tag: "wx25t", text: "请点击所有包含<b>WX25T</b>的图片块" },
    { tag: "classical-25t", text: "请点击所有包含<b>原色25T</b>的图片块" },
    { tag: "louis", text: "请点击所有包含<b>路易十六</b>的图片块" },
    { tag: "locomotive", text: "请点击所有包含<b>铁路机车</b>的图片块" },
    { tag: "golden-eagle", text: "请点击所有包含<b>金鹰轨道车</b>的图片块" },
    { tag: "bsp25t", text: "请点击所有包含<b>BSP 25T</b>的图片块" },
    { tag: "backhaul", text: "请点击所有包含<b>回送机车/车底</b>的图片块" }
]

function getRandomInt(min: number, max: number): number {
  // 确保 min 和 max 是整数，防止因浮点数传入导致逻辑错误
  min = Math.ceil(min);
  max = Math.floor(max);
  // 核心公式
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function getQuestion(): Promise<SelectedQuestion> {
    const imgId = getRandomInt(MIN_IMG, MAX_IMG)

    const meta = await (await fetch(`metas/${imgId}.json`)).json() as Record<string, number[]>
    const tag = Object.keys(meta)[getRandomInt(0, Object.keys(meta).length - 1)]!
    const question = QUESTIONS.find(q => q.tag === tag)!

    return {
        imgId,
        text: question.text,
        answer: meta[tag]!
    }
}