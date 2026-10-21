# Feng Yu / 枫语

**I study AI, and I build tools and simulations. I write down the process, the results, and the limits.**

I care about how models learn, how instructions get read with only one possible interpretation, and how an idea becomes something you can put your hands on and verify.

[Website](https://meiluosi.github.io/) · [Field notes](https://meiluosi.github.io/notes/) · [Lab](https://meiluosi.github.io/lab/) · [Model workbench](https://meiluosi.github.io/lab/model-pipeline/) · [Hugging Face](https://huggingface.co/fengyu116) · [Zhihu](https://www.zhihu.com/people/feng-chui-guo-de-jie-dao-39) · [Email](mailto:1160337988@qq.com) · [中文](README.md)

<p align="center">
  <img src="./assets/hero-banner.en.svg" alt="Feng Yu's research and engineering map: preregistered experiments, mechanical simulation, agent composition diagnostics, and evidence-driven FDE delivery" width="880" />
</p>

## Current work

### Can real fly mushroom-body wiring act as an inductive bias for learning and optimization?

Using the Janelia MaleCNS real wiring of the fruit fly mushroom body (65 olfactory glomeruli → 2,045 Kenyon cells → 49 output neurons), I test across five task families whether real wiring beats degree-preserving shuffles, random sparse wiring, or simple linear learners. Decision criteria are preregistered and file hashes are frozen before any run.

**Status: in every setting that could actually be tested, real wiring showed no measured advantage over random sparse wiring or simple linear learners. That is "no evidence under the current setting", not "proof that real wiring carries no computational value". The meta-learning arm was first missed because the forgetting rate was parameterized to a start point in the flat tail; after fixing the start point it was re-run across 100 new worlds, and the correction is published rather than quietly patched.**

[Experiment repo and independent review](https://github.com/meiluosi/fly-connectome-study) · [Final summary](https://github.com/meiluosi/fly-connectome-study/blob/main/FINAL_SUMMARY.md) · [The 11-part series with figures](https://github.com/meiluosi/fly-connectome-study/blob/main/blog/README.md) · [The experiment-writing skill extracted from it](https://github.com/meiluosi/research-writing-skills)

### Strandbeest lab

Adjust the linkage, watch the gait, and explore how design, simulation, and manufacturing relate. There is a linkage editor, simulation playback, and a printable-part export.

<p align="center">
  <a href="https://github.com/meiluosi/strandbeest-evolution">
    <img src="https://raw.githubusercontent.com/meiluosi/strandbeest-evolution/main/docs/assets/walker.gif" alt="Strandbeest linkage motion: several legs stepping with different phases" width="640" height="300" />
  </a>
  <br />
  <sub>Jansen linkage motion · click for the project</sub>
</p>

**Status: alpha; not yet validated against real hardware.**

[See the demo and the source](https://github.com/meiluosi/strandbeest-evolution)

### Fewer agent misreadings, fewer failures at composition boundaries

Instructions written for agents are first clarified with a Chinese disambiguation tool that pins down the executor, the conditions, and the boundaries; a rewrite-fidelity tool then checks that numbers, literals, comparison direction, negation, and modal strength have not drifted. When several nodes are assembled into a LangGraph graph and only then break — a subgraph overwriting parent state, two parallel writes to one key, a node returning undeclared fields, a repeated side effect after resume — `acr` static scanning and failure-trace diagnostics put the problem on **a specific file line or trace event ID**.

**Status: `agent-composition-review` is in v0.6.0 maintenance mode (features frozen; the focus is real false positives, compatibility, and documentation; no production accuracy is claimed). Disambiguation and fidelity checks still need human judgment beyond mechanical comparison.**

[Agent composition diagnostics (ACR)](https://github.com/meiluosi/agent-composition-review) · [Chinese rewrite, before and after](https://github.com/meiluosi/zh-disambiguate-skill) · [Rewrite fidelity check](https://github.com/meiluosi/rewrite-fidelity-skill)

### Running a small-model training pipeline from scratch

On a personal computer: data, tokenization, random-init pretraining, SFT, DPO, evaluation, and local inference, with checkpoint saving, resuming, and run records kept along the way. A serialized body of work covers the whole data-engineering path — corpus selection maps, web cleaning, quality scoring, deduplication and decontamination, Chinese/English mixing ratios, and traceable corpus packaging.

<p align="center">
  <a href="https://meiluosi.github.io/lab/model-pipeline/">
    <img src="./assets/llm-training-pipeline.svg" alt="Pretraining data engineering and the full small-model training pipeline: corpus selection, cleaning, quality scoring, deduplication and decontamination, Chinese/English mixing, then pretraining, SFT, and DPO" width="880" />
  </a>
  <br />
  <sub>Data engineering and the alignment pipeline · open the model workbench and the run records</sub>
</p>

**Status: the engineering path is verified end to end on a 138,560-parameter tiny model; a 30M ablation and a 1B local run on MacBook Air M4 are in progress.**

[Implementation and run records](https://github.com/meiluosi/meiluosi.github.io/tree/master/projects/small-model-lab) · [Open the model workbench](https://meiluosi.github.io/lab/model-pipeline/) · [Hugging Face weights and data](https://huggingface.co/fengyu116) · [Discussion on Zhihu](https://www.zhihu.com/people/feng-chui-guo-de-jie-dao-39)

## FDE field delivery series

Seven independent skills for frontline deployment engineers (FDE / presales / delivery / consultants). Every repo has zero third-party Python dependencies; they hand off through artifacts you read yourself (industry maps, problem-definition cards, selection scorecards, demo briefs, pilot plans) and are not force-installed together.

<p align="center">
  <img src="./assets/fde-pipeline-anim.svg" alt="The evidence-driven FDE delivery workflow: industry ramp, problem framing, route selection, knowledge-base diagnosis, then client demo and a preregistered pilot, with communication running through the whole cycle" width="880" />
</p>

| Stage and repo | What it manages | Core criterion / output |
|---|---|---|
| [fde-ramp](https://github.com/meiluosi/fde-ramp) | Build the basics of an industry before meeting a client: draw the map that will get changed, then let frontline staff correct it. Includes coalbed-methane and web-novel industry packs | End-to-end map, 50-term jargon sheet, open-question list, self-check score |
| [fde-problem-framing](https://github.com/meiluosi/fde-problem-framing) | Turn a client request into a problem with an evidence boundary, comparing process, rules, traditional software, and AI side by side | `Supported / Unknown / Unsupported` × `Proceed / Investigate / Non-AI / Stop-Defer` |
| [fde-route-selection](https://github.com/meiluosi/fde-route-selection) | After the problem is framed: filter hard constraints on compliance and deployment, then pick a route that fits, then compare model quality, cost, and latency on the client's own samples | Constraint gate table, route comparison, client-sample bakeoff plan |
| [fde-knowledge-base](https://github.com/meiluosi/fde-knowledge-base) | When the route involves document retrieval (RAG): survey the real document situation, governance ownership, and verbatim fallback, then locate the quality bottleneck across the retrieval / generation / knowledge layers | Sampling survey table (with Wilson intervals), four-layer task eval set, `Proceed / Investigate / Pivot / Stop-Defer` |
| [fde-demo](https://github.com/meiluosi/fde-demo) | Treat the client demo as validation and as a conversation that earns trust: preregister red lines and signals beforehand, and afterwards look at what the client **did**, not what they said | Rehearsal review, verbatim-vs-interpretation field record, three-axis debrief verdict |
| [fde-pilot](https://github.com/meiluosi/fde-pilot) | Turn a demo that passed into a **preregistered** pilot, counting human review and correction in the business metrics, and forbidding post-hoc metric swaps | Preregistration check, mid-term warning, effect with bootstrap interval report |
| [fde-comms](https://github.com/meiluosi/fde-comms) | The conversations that run through the whole cycle: get information out of people, and send conclusions and bad news upward | Pre-meeting interview outline, post-meeting minutes with paraphrase check, one-page exec summary, bad-news draft |

## Research, writing and content workflow skills

Claude and Codex skills I built, grouped by purpose. Every repo ships an English and a Chinese description, worked examples, and an honest account of what it does and does not do.

### Trustworthy experiments and precise writing

| Skill | What it does |
|---|---|
| [research-writing-skills](https://github.com/meiluosi/research-writing-skills) | Extracted from the fly connectome project: preregistered experiment protocols, independent no-context review, document-level editing, rewrite fidelity checks, and routing |
| [zh-disambiguate-skill](https://github.com/meiluosi/zh-disambiguate-skill) | Rewrites Simplified Chinese so an agent has only one possible reading, turning missing information into a question back to the author; ships a zero-dependency linter and an evaluation set |
| [rewrite-fidelity-skill](https://github.com/meiluosi/rewrite-fidelity-skill) | Checks whether a rewrite changed numbers, literals, conditions, threshold direction (at least vs at most), negation, and modal strength (MUST/SHOULD/MAY) |

### Learn, plan, write, make images (an optional chain)

From understanding a technique, to writing it out, to turning it into images. Each link works on its own and can be chained.

| Skill | What it does |
|---|---|
| [research-learning](https://github.com/meiluosi/research-learning) | Learn machine learning and LLM techniques the way a research engineer would: five-step lessons where every claim is labelled as taken from a paper, derived, or unverified; verification and experiment design only when they are needed |
| [content-topic-decomposer](https://github.com/meiluosi/content-topic-decomposer) | Breaks a topic into a balanced content plan: five content types × four reader stages × four formats, plus turning one experience into many reusable versions |
| [human-in-the-loop-writing](https://github.com/meiluosi/human-in-the-loop-writing) | Write with AI without losing yourself: research, draft, a five-question check, and learn the rules from your own edits |
| [content-card-designer](https://github.com/meiluosi/content-card-designer) | Turns content into image cards, covers, and avatars: text is typeset in the browser, real assets are never redrawn by a generative model, and quality is checked before export |

## Writing and notes

Reading, experiments, and the problems that show up while making things. More on [meiluosi.github.io](https://meiluosi.github.io/).

| English article | What it covers |
|---|---|
| [From Data to Deployment — A Small-Model Training Plan](https://meiluosi.github.io/en/posts/local-1b-model-workflow/) | Planning a full small-model training path on a Mac, from data and tokenization to SFT, DPO, evaluation, and deployment |
| [A Practical Overview of LLM Training](https://meiluosi.github.io/en/posts/llm-training-pipeline-overview/) | The training pipeline as a whole: what each stage actually changes |
| [A Practical Guide to LLM Agents](https://meiluosi.github.io/en/posts/llm-agent-development-guide/) | Building agents that stay debuggable instead of becoming a pile of prompts |
| [Parameter-Efficient Fine-Tuning with LoRA and PEFT](https://meiluosi.github.io/en/posts/parameter-efficient-fine-tuning-lora/) | Choosing between full fine-tuning, LoRA, and QLoRA by update space, memory, and quantization |
| [LLM Inference Optimization and Deployment](https://meiluosi.github.io/en/posts/llm-inference-optimization/) | What to measure when a model has to run fast enough to be useful |
| [Retrieval-Augmented Generation in Practice](https://meiluosi.github.io/en/posts/rag-retrieval-augmented-generation/) | Where RAG fails in practice, and how to tell retrieval problems from generation problems |
| [Monte Carlo Tree Search: Core Ideas and Variants](https://meiluosi.github.io/en/posts/monte-carlo-tree-search-overview/) | Selection, expansion, simulation, backpropagation, and the variants worth knowing |
| [Causal Inference with YLearn](https://meiluosi.github.io/en/posts/ylearn-causal-inference/) | Estimating causal effects when the question is not correlation |

<!-- releases starts -->
### Recent releases

- [fde-problem-framing v0.3.0](https://github.com/meiluosi/fde-problem-framing/releases/tag/v0.3.0) · 2026-10-20 `pre`
- [agent-composition-review v0.6.0](https://github.com/meiluosi/agent-composition-review/releases/tag/v0.6.0) · 2026-10-17
- [rewrite-fidelity-skill v0.1.2](https://github.com/meiluosi/rewrite-fidelity-skill/releases/tag/v0.1.2) · 2026-10-14
- [zh-disambiguate-skill v0.1.2](https://github.com/meiluosi/zh-disambiguate-skill/releases/tag/v0.1.2) · 2026-10-14
<!-- releases ends -->

## Retrospectives and convergence notes

- [md-knowledge-graph: engineering done — why stop expanding anyway?](https://github.com/meiluosi/md-knowledge-graph/blob/main/docs/retrospective.md) — Checks reference integrity and tag consistency in markdown. The objective part overlaps with `lychee`; the distinctive part is an opinion the tool invented. The project is frozen in maintenance mode, keeping the code, the actual usage records, and the retrospective.
- [fly-connectome-study: when none of five test lines found an advantage, what can and cannot be said?](https://github.com/meiluosi/fly-connectome-study/blob/main/FINAL_SUMMARY.md) — Keeps every negative result, the analysis of control-arm defects, and the record of the meta-learning parameterization correction.

## Contact

- **Email** — [1160337988@qq.com](mailto:1160337988@qq.com)
- **On the site** — [meiluosi.github.io/contact](https://meiluosi.github.io/contact/)
- **Good topics to start from** — papers and reproductions · causal reasoning and evaluation · agents, research systems, and RSI

---

<sub>Selected work and project status are maintained by hand; recent releases are refreshed by the [build script](./build_readme.mjs). When a data source is unavailable, the previous content is kept.</sub>
