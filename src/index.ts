import * as process from 'node:process';
import puppeteer from 'puppeteer';
import { fetchCoinData, wait } from './fetchCoinData';
import { Bot, InputFile } from 'grammy';
import sharp from 'sharp';

const bot = new Bot(process.env.BOT_TOKEN)

async function run() {

    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1200 });
    await page.goto('file://' + __dirname + '/template/index.html');
    await page.evaluate(async (data) => {
        document.dispatchEvent(new CustomEvent('data', { detail: data }));
    }, await fetchCoinData())

    setTimeout(async () => {
        await page.screenshot({ path: 'screenshot.png', type: "png" });

        const sticker_set = await bot.api.getStickerSet(process.env.PACK_NAME)
        const stickers_to_delete = sticker_set.stickers.map(el => el.file_id)
        try {
            for (const stickerId of stickers_to_delete) {
                await bot.api.deleteStickerFromSet(stickerId)
                await wait(1000)
            }
        } catch(err) {
            console.log(err)
        }

        await bot.api.addStickerToSet(process.env.OWNER_ID, process.env.PACK_NAME, {
            sticker: new InputFile(await sharp("screenshot.png")
              .resize(512, 512)
              .toBuffer()),
            format: "static",
            emoji_list: ["🚀"]
        })

        browser.close();

    }, 500)
}

run();
