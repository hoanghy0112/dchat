import GUN from "gun";
import "gun/sea";
import "gun/axe";

export const db = GUN({ peers: ["https://dchat-api.hoanghy.space/gun"] });

export const user = db.user().recall({ sessionStorage: true });

db.on("auth", async (event) => {
	const alias = await user.get("alias"); // username string
	username.set(alias);
});
