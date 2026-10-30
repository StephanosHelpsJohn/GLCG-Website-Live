// GLC site: mobile menu, film autoplay fallback, hero operations graph.
(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mobile menu
    const nav = document.querySelector(".nav");
    const btn = document.querySelector(".menu-btn");
    if (nav && btn) {
        btn.addEventListener("click", () => {
            const open = nav.classList.toggle("open");
            btn.setAttribute("aria-expanded", String(open));
            btn.textContent = open ? "Close" : "Menu";
        });
        nav.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => {
            nav.classList.remove("open");
            btn.setAttribute("aria-expanded", "false");
            btn.textContent = "Menu";
        }));
    }

    // Film: autoplays on a silent loop; a tap starts it if a phone held it back
    const film = document.querySelector(".film video");
    if (film) film.addEventListener("click", () => { if (film.paused) film.play().catch(() => {}); });

    // Operations graph: systems send data into the agent layer, it writes back into another
    // system and the thing it created lands in the feed.
    const graph = document.querySelector(".graph");
    if (!graph) return;
    const body = graph.querySelector(".graph-body");
    const svg = graph.querySelector(".graph-wires");
    const core = graph.querySelector(".core");
    const coreTask = graph.querySelector(".core-task");
    const feed = graph.querySelector(".feed");
    const runsEl = graph.querySelector(".runs");
    const nodes = Object.fromEntries([...graph.querySelectorAll(".node")].map((n) => [n.dataset.id, n]));
    const name = (id) => nodes[id].querySelector("b").textContent;

    const RUNS = [
        { from: ["hubspot", "gmail"], to: "gmail", tag: "Email", task: "drafting follow-ups", text: "Drafted 14 deal follow-ups from yesterday's calls, queued for each rep" },
        { from: ["netsuite", "gmail"], to: "slack", tag: "Finance", task: "reconciling invoices", text: "Matched 312 invoices to purchase orders and flagged 3 for finance" },
        { from: ["datadog", "github"], to: "jira", tag: "Engineering", task: "tracing an error spike", text: "Traced checkout errors to one deploy and opened a fix with the logs attached" },
        { from: ["snowflake", "salesforce"], to: "m365", tag: "Report", task: "building the board report", text: "Built the Q3 board report: pipeline, revenue and churn, with commentary" },
        { from: ["zendesk", "m365"], to: "zendesk", tag: "Support", task: "answering tickets", text: "Answered 41 tickets from the help center and escalated 5 to a person" },
        { from: ["greenhouse", "snowflake"], to: "greenhouse", tag: "Search", task: "mapping the COO market", text: "Mapped 1,240 operators and scored a COO slate of 6 against the scorecard" },
        { from: ["salesforce", "netsuite"], to: "netsuite", tag: "Sync", task: "syncing deals to billing", text: "Synced 58 closed-won deals into billing with the right terms" },
        { from: ["jira", "slack"], to: "slack", tag: "Brief", task: "writing the ops brief", text: "Wrote Monday's ops brief for every team lead: what shipped, what's blocked" },
    ];

    // Wires: one per system into the core, plus one from the core to the feed
    const NS = "http://www.w3.org/2000/svg";
    const el = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
    svg.innerHTML = `<defs>
        <radialGradient id="pk-glow"><stop offset="0" stop-color="#22d3ee" stop-opacity=".95"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>
        <radialGradient id="pk-glow-v"><stop offset="0" stop-color="#c4b5fd" stop-opacity=".95"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient>
    </defs>`;
    const wireLayer = el("g", {}), pkLayer = el("g", {});
    svg.append(wireLayer, pkLayer);
    const ids = Object.keys(nodes);
    const wires = Object.fromEntries(ids.map((id) => [id, wireLayer.appendChild(el("path", { class: "wire" }))]));
    const outWire = wireLayer.appendChild(el("path", { class: "wire out" }));

    const layout = () => {
        const b = body.getBoundingClientRect();
        if (!b.width) return;
        svg.setAttribute("viewBox", `0 0 ${b.width} ${b.height}`);
        const stacked = getComputedStyle(body).gridTemplateColumns.split(" ").length === 1;
        const c = core.getBoundingClientRect();
        const cx = c.left + c.width / 2 - b.left, cy = c.top + c.height / 2 - b.top, r = c.width / 2 - 6;
        const curve = (sx, sy, ex, ey) => stacked
            ? `M${sx},${sy} C${sx},${(sy + ey) / 2} ${ex},${(sy + ey) / 2} ${ex},${ey}`
            : `M${sx},${sy} C${(sx + ex) / 2},${sy} ${(sx + ex) / 2},${ey} ${ex},${ey}`;
        const list = graph.querySelector(".nodes").getBoundingClientRect();
        ids.forEach((id) => {
            const n = nodes[id].getBoundingClientRect();
            // fan the wires into the core's edge, in the order the systems sit on screen
            const spread = stacked
                ? ((n.left + n.width / 2 - list.left) / list.width - 0.5) * 1.3
                : ((n.top + n.height / 2 - list.top) / list.height - 0.5) * 1.3;
            if (stacked) {
                const a = -Math.PI / 2 + spread;
                wires[id].setAttribute("d", curve(n.left + n.width / 2 - b.left, n.bottom - b.top, cx + r * Math.cos(a), cy + r * Math.sin(a)));
            } else {
                const a = Math.PI + spread;
                wires[id].setAttribute("d", curve(n.right - b.left, n.top + n.height / 2 - b.top, cx + r * Math.cos(a), cy - r * Math.sin(a)));
            }
        });
        const f = feed.getBoundingClientRect();
        outWire.setAttribute("d", stacked
            ? curve(cx, cy + r, f.left + f.width / 2 - b.left, f.top - b.top)
            : curve(cx + r, cy, f.left - b.left, f.top + 40 - b.top));
    };
    new ResizeObserver(layout).observe(body);
    if (document.fonts) document.fonts.ready.then(layout);

    // Feed cards
    const ago = (t) => { const s = Math.round((Date.now() - t) / 1000); return s < 5 ? "just now" : s < 60 ? `${s}s ago` : `${Math.round(s / 60)}m ago`; };
    const card = (run, t, type) => {
        const li = document.createElement("li");
        li.className = "card";
        li.dataset.t = t;
        li.innerHTML = `<div class="card-top"><span class="tag"></span><span class="when"></span></div><p></p><div class="via"></div>`;
        li.querySelector(".tag").textContent = run.tag;
        li.querySelector(".when").textContent = ago(t);
        li.querySelector(".via").textContent = `${run.from.map(name).join(" + ")} → ${name(run.to)}`;
        const p = li.querySelector("p");
        feed.prepend(li);
        while (feed.children.length > 5) feed.lastElementChild.remove();
        if (!type) { p.textContent = run.text; return; }
        let i = 0;
        const iv = setInterval(() => { p.textContent = run.text.slice(0, ++i); if (i >= run.text.length) clearInterval(iv); }, 16);
    };
    [RUNS[6], RUNS[7], RUNS[3]].forEach((r, k) => card(r, Date.now() - (3 - k) * 47000));

    if (reduce) { coreTask.textContent = "3 agents running"; return; }

    // Packets travel along a wire; the promise settles when they arrive
    const packets = [];
    let raf = 0, visible = false;
    const ease = (k) => k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
    const send = (path, dur, reverse, make) => new Promise((res) => {
        const g = pkLayer.appendChild(el("g", { class: make ? "pk make" : "pk" }));
        g.append(el("circle", { class: "pk-halo", r: 10 }), el("circle", { class: "pk-dot", r: 2.4 }));
        packets.push({ path, len: path.getTotalLength(), t0: performance.now(), dur, reverse, g, res });
        if (!raf && visible) raf = requestAnimationFrame(tick);
    });
    const tick = (now) => {
        for (let i = packets.length - 1; i >= 0; i--) {
            const p = packets[i];
            const k = (now - p.t0) / p.dur;
            if (k >= 1) { p.g.remove(); packets.splice(i, 1); p.res(); continue; }
            const pt = p.path.getPointAtLength(p.len * (p.reverse ? 1 - ease(k) : ease(k)));
            p.g.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        }
        raf = packets.length && visible ? requestAnimationFrame(tick) : 0;
    };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const flag = (id, cls, on) => { nodes[id].classList.toggle(cls, on); wires[id].classList.toggle("hot", on); };

    let runs = 0, wake = null;
    const play = async (run) => {
        coreTask.textContent = run.task;
        run.from.forEach((id) => flag(id, "on", true));
        await Promise.all(run.from.map((id, k) => sleep(k * 160).then(() => send(wires[id], 1000))));
        run.from.forEach((id) => flag(id, "on", false));
        core.classList.add("pulse");
        setTimeout(() => core.classList.remove("pulse"), 600);
        flag(run.to, "write", true);
        outWire.classList.add("hot");
        const back = send(wires[run.to], 900, true, true);
        await send(outWire, 750, false, true);
        card(run, Date.now(), true);
        runsEl.textContent = ++runs;
        await back;
        await sleep(500);
        flag(run.to, "write", false);
        outWire.classList.remove("hot");
    };
    (async () => {
        for (let i = 0; ; i = (i + 1) % RUNS.length) {
            if (!visible || document.hidden) await new Promise((r) => { wake = r; });
            await play(RUNS[i]);
            await sleep(1100);
        }
    })();
    const resume = () => {
        if (!visible || document.hidden) return;
        packets.forEach((p) => { p.t0 = performance.now() - 1e6; });  // finish anything that stalled offscreen
        if (!raf && packets.length) raf = requestAnimationFrame(tick);
        if (wake) { wake(); wake = null; }
    };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; resume(); }).observe(graph);
    document.addEventListener("visibilitychange", resume);
    setInterval(() => feed.querySelectorAll(".card").forEach((c) => { c.querySelector(".when").textContent = ago(+c.dataset.t); }), 5000);
})();
