const API_URL = "https://foodhub-backend-silk.vercel.app/api";

const CATEGORIES = {
    FAST_FOOD: "cml2answw0000dcphfny916oj",
    PIZZA: "cml2antct0001dcphnt7wzut3",
    ASIAN: "cml2antsg0002dcphiew91qrv",
    ITALIAN: "cml2anv3r0005dcph9d24lzjm",
    HEALTHY: "cml2anvjd0006dcphf2vfrt44",
    KABABS: "cml2atehy0001fsph8ebalo7i",
    DESHI: "cml2ate2h0000fsphlboitx2n"
};

const PROVIDERS = [
    {
        name: "Burger King",
        email: "bk@test.com",
        password: "password123",
        meals: [
            {
                name: "Classic Cheeseburger",
                description: "Juicy beef patty with cheddar cheese, lettuce, and tomato on a brioche bun.",
                price: 350,
                categoryId: CATEGORIES.FAST_FOOD,
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
                isAvailable: true
            }
        ]
    },
    {
        name: "Pizza Hut",
        email: "ph@test.com",
        password: "password123",
        meals: [
            {
                name: "Margherita Pizza",
                description: "Fresh basil, mozzarella cheese, and tomato sauce on a thin crust.",
                price: 650,
                categoryId: CATEGORIES.PIZZA,
                image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80",
                isAvailable: true
            }
        ]
    },
    {
        name: "Star Kabab",
        email: "sk@test.com",
        password: "password123",
        meals: [
            {
                name: "Beef Sheek Kabab",
                description: "Juicy minced beef mixed with traditional spices and grilled on skewers.",
                price: 220,
                categoryId: CATEGORIES.KABABS,
                image: "https://images.unsplash.com/photo-1627916603058-20a22cf8867a?w=800&q=80",
                isAvailable: true
            },
            {
                name: "Butter Naan",
                description: "Soft and fluffy flatbread baked in a tandoor and brushed with butter.",
                price: 60,
                categoryId: CATEGORIES.ASIAN, // Fallback or distinct
                image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80",
                isAvailable: true
            }
        ]
    },
    {
        name: "Sultan's Dine",
        email: "sd@test.com",
        password: "password123",
        meals: [
            {
                name: "Kacchi Biriyani",
                description: "Traditional Bangladeshi aromatic rice dish with tender mutton pieces and potatoes.",
                price: 480,
                categoryId: CATEGORIES.ASIAN,
                image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80",
                isAvailable: true
            }
        ]
    }
];

async function seed() {
    console.log("🌱 Starting seed process...");

    for (const provider of PROVIDERS) {
        console.log(`\nProcessing Provider: ${provider.name}`);

        let token = "";
        let cookies = "";

        // 1. Try Login
        console.log("  Logging in...");
        let loginRes = await fetch(`${API_URL}/auth/sign-in/email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: provider.email, password: provider.password })
        });

        // 2. Register if login fails
        if (!loginRes.ok) {
            console.log("  Login failed, registering...");
            const regRes = await fetch(`${API_URL}/auth/sign-up/email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: provider.email,
                    password: provider.password,
                    name: provider.name,
                    role: "provider"
                })
            });

            if (!regRes.ok) {
                const err = await regRes.text();
                console.error(`  Registration failed: ${err}`);
                continue;
            }
            // Auto login/get session from reg? Usually need to login again or rely on Set-Cookie
            // Let's explicitly login after register to be safe
            loginRes = await fetch(`${API_URL}/auth/sign-in/email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: provider.email, password: provider.password })
            });
        }

        if (loginRes.ok) {
            // Capture cookies
            const setCookie = loginRes.headers.get("set-cookie");
            if (setCookie) cookies = setCookie;

            // Or if body has token
            const data = await loginRes.json();
            if (data.token) token = data.token;

            // Need headers for subsequent requests
            const headers = {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                ...(cookies ? { "Cookie": cookies } : {})
            };

            console.log("  Authenticated!");

            // 3. Create Meals
            for (const meal of provider.meals) {
                console.log(`  Creating meal: ${meal.name}`);
                const mealRes = await fetch(`${API_URL}/meals`, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(meal)
                });

                if (mealRes.ok) {
                    console.log("    ✅ Created");
                } else {
                    const err = await mealRes.text();
                    console.error(`    ❌ Failed: ${err}`);
                }
            }
        } else {
            console.error("  Login completely failed.");
        }
    }
    console.log("\n✅ Seeding complete!");
}

seed();
