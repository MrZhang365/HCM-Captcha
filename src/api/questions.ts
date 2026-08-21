import { metas } from './image-meta'

export interface ImageMeta {
    tags: string[],
    answers: Record<string, number[]>,
}

export interface Question {
    tag: string,
    text: string,
}

export interface SelectedQuestion {
    imgId: number,
    text: string,
    answer: number[],
}

export const QUESTIONS: Question[] = [
    { tag: 'general', text: '请点击所有包含<b>朝鲜车厢</b>的图片块' },
    { tag: 'wx25t', text: '请点击所有包含<b>WX25T</b>的图片块' },
    { tag: 'classical-25t', text: '请点击所有包含<b>原色25T</b>的图片块' },
    { tag: 'louis', text: '请点击所有包含<b>路易十六</b>的图片块' },
    { tag: 'locomotive', text: '请点击所有包含<b>铁路机车</b>的图片块' },
    { tag: 'golden-eagle', text: '请点击所有包含<b>金鹰轨道车</b>的图片块' },
    { tag: 'bsp25t', text: '请点击所有包含<b>BSP 25T</b>的图片块' },
    { tag: 'backhaul', text: '请点击所有包含<b>回送机车/车底</b>的图片块' },
]

export const MIN_IMG = 0
export const MAX_IMG = 23

export function getQuestion(): SelectedQuestion {
    const imgId = Math.floor(Math.random() * (MAX_IMG - MIN_IMG + 1)) + MIN_IMG
    const tags = metas[imgId]!.tags
    const tag = tags[Math.floor(Math.random() * tags.length)]!

    return {
        imgId,
        text: QUESTIONS.find(q => q.tag === tag)!.text,
        answer: metas[imgId]!.answers[tag]!
    }
}