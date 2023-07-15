import { PIX } from "gpix/dist";
import { client } from "..";
import { createCanvas, loadImage } from "canvas";

export class Utils {

    public static async genPix(price: number, description: string) {

        const pix = PIX.static()
        .setReceiverName(client.user?.username as string)
        .setReceiverCity('Brasil')
        .setKey('309c1c85-4adf-4e82-ae82-a1a2c79a0bd3')
        .setDescription(description)
        .setAmount(price);


        const image = createCanvas(1024, 1024);
        const ctx = image.getContext('2d');
        const load = await loadImage(await pix.getQRCode() as string);
        ctx.fillStyle = '#4040ff';
        ctx.fillRect(0, 0, image.width, image.height);
        ctx.drawImage(load, 54.5, 54.5, 915, 915);

        return image;
    }

    public static async PasteAndCopy(price: number, description: string) {
        const pix = PIX.static().setReceiverName(client.user?.username as string).setReceiverCity('Brasil').setKey('309c1c85-4adf-4e82-ae82-a1a2c79a0bd3').setDescription(description).setAmount(price);
        return pix.getBRCode();
    }

}