# 枫语 / Feng Yu

**核心主线：探索“智能是什么？”——在物理具身、生物回路、统计学习与符号推理的交界处做可检验的实证。**

智能并没有单一、排他的终极定义。它既不是单纯的规模化（Scaling）拟合，也不是单纯的神经布线或抽象规则。跨越控制论、连接主义、形态计算、动力系统与认知哲学，我关心的是：**不同形式的智能究竟如何涌现？它们的计算与物理边界在哪里？以及怎样用不自欺的严谨实验去测量它们。**

[个人网站](https://meiluosi.github.io/) · [研究笔记](https://meiluosi.github.io/notes/) · [实验室](https://meiluosi.github.io/lab/) · [模型工作台](https://meiluosi.github.io/lab/model-pipeline/) · [Hugging Face](https://huggingface.co/fengyu116) · [知乎](https://www.zhihu.com/people/feng-chui-guo-de-jie-dao-39) · [邮件联系](mailto:1160337988@qq.com) · [English](README.en.md)

<p align="center">
  <img src="./assets/hero-banner.svg" alt="枫语的研究与工程版图：可检验实验、机械仿真、Agent组合诊断与FDE证据交付" width="880" />
</p>

## 探索地图与实证坐标

关于智能的研究，并不只是争论“哪一种算法更强”，而是在追问：究竟什么现象需要被解释、应该以什么系统为单位，以及怎样才算解释已经完成。我不预设某一种理论已经垄断了智能的本质，而是把探索锚定在几个互为镜像、能够动手构造与检验的实证切面上：

```
                    ┌───────────────────────────────┐
                    │       探索：智能是什么？       │
                    └──────────────┬────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
   【具身与形态计算】        【生物回路与演化偏置】    【统计压缩与表征涌现】
  风力兽实验室 (Jansen)    果蝇连接组研究 (FlyModel)    从零训练小模型 (Tiny-1B)
  动力学/环境如何代偿大脑？ 真实拓扑是否提供计算先验？ 压缩何时质变为世界模型？
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   ▼
                         【符号操作与组合推理】
                     Agent组合边界诊断 (ACR) / 消歧保真
                     连续嵌入与离散逻辑的保真边界在哪？
                                   │
                                   ▼
                  【认识论与度量：反自欺与证据驱动】
              预注册实验协议 · 负结果复盘 · FDE证据驱动交付
```

---

## 实证研究与工程项目

### 1. 具身与形态计算：风力兽实验室

调整连杆，观察步态，探索设计、仿真与制造之间的关系。**追问的核心问题：智能是否必须先在脑内计算？身体材料、几何连杆与物理环境的耦合，能分担多少传统控制器的计算职责？**

<p align="center">
  <a href="https://github.com/meiluosi/strandbeest-evolution">
    <img src="https://raw.githubusercontent.com/meiluosi/strandbeest-evolution/main/docs/assets/walker.gif" alt="风力兽连杆运动示意：多条腿以不同相位交替迈步" width="640" height="300" />
  </a>
  <br />
  <sub>Jansen 连杆运动示意 · 点击动图查看项目与连杆编辑器</sub>
</p>

**状态：alpha；已有连杆几何编辑器、动力学仿真回放与可打印切片包导出；尚未用真实硬件在非平稳地形验证。**

[看演示与源码](https://github.com/meiluosi/strandbeest-evolution)

### 2. 生物回路与演化偏置：真实果蝇连接组能否当作学习归纳偏置？

用 Janelia MaleCNS 的果蝇蘑菇体真实连线（65 个嗅觉小球 → 2,045 个 Kenyon 细胞 → 49 个输出神经元），在隔间与遗忘、持续学习审计（FlyModel）、非平稳气味觅食、果蝇群、元学习与旅行商问题（TSP 三轮）中，预先登记判定标准并冻结文件哈希，检验“生物演化筛选的真实连线是否优于保度数打乱、随机稀疏或简单线性学习器”。

<p align="center">
  <a href="https://github.com/meiluosi/fly-connectome-study">
    <img src="./assets/fly-connectome-anim.svg" alt="果蝇蘑菇体连接组预注册检验示意：65个嗅觉小球到2045个Kenyon细胞再到49个输出神经元，对比打乱与随机稀疏对照" width="880" />
  </a>
  <br />
  <sub>MaleCNS 蘑菇体回路与五条检验线 · 点击查看预先登记协议、独立审查与复现代码</sub>
</p>

**状态与结论：在所有能被检验的设定里，真实连线都没有测出优于随机稀疏连线或简单线性学习器的优势（这是“当前设定下无证据”，而非“证明真实连线无计算意义”）。元学习首次因遗忘速率参数化起点落在平坦尾部而漏检，修复起点后在 100 个新世界重跑并公开更正。**

[看实验仓库与独立审查](https://github.com/meiluosi/fly-connectome-study) · [阅读最终总结](https://github.com/meiluosi/fly-connectome-study/blob/main/FINAL_SUMMARY.md) · [7 篇系列文章与配图](https://github.com/meiluosi/fly-connectome-study/blob/main/blog/README.md) · [提炼出的实验写作 Skill](https://github.com/meiluosi/research-writing-skills)

### 3. 统计压缩与表征涌现：从零跑通小模型训练全流程

在个人计算资源（从几万参数到 1B MacBook 本地）上连接数据、分词、随机初始化预训练、SFT、DPO、评测与本地推理。**追问的核心问题：高维参数空间里的自监督预测，在什么临界点从表面统计模式匹配跃迁为具备因果推断能力的隐式模型？小模型在受限计算资源下的表征极限在哪里？**

<p align="center">
  <a href="https://meiluosi.github.io/lab/model-pipeline/">
    <img src="./assets/llm-training-pipeline.svg" alt="小模型预训练数据工程与全链路训练流水线：语料选型、清洗、质量评分、去重抗污染、中英配比到预训练、SFT与DPO对齐" width="880" />
  </a>
  <br />
  <sub>小模型全链路预训练数据工程与对齐流水线 · 点击查看模型工作台与实验记录</sub>
</p>

**状态：已完成 138,560 参数 tiny 模型的工程验证与流水线打通；30M 消融实验与 1B MacBook Air M4 本地实战推进中；系统整理可追溯语料打包与数据工程实践。**

[看实现与实验记录](https://github.com/meiluosi/meiluosi.github.io/tree/master/projects/small-model-lab) · [打开模型工作台](https://meiluosi.github.io/lab/model-pipeline/) · [Hugging Face 权重与数据](https://huggingface.co/fengyu116) · [知乎专栏讨论](https://www.zhihu.com/people/feng-chui-guo-de-jie-dao-39)

### 4. 符号系统与组合推理：让 Agent 少误读、少在组合边界出故障

写给 Agent 的指令先用中文消歧工具澄清执行者、条件和边界，再用改写保真工具核对数字、字面量、比较方向、否定和语气强度有没有漂移；当多个节点拼成 LangGraph 图之后才坏（子图覆盖父图状态、并行写同一键、返回未声明字段、resume 后重复副作用），用 `acr` 静态扫描与失败轨迹诊断把问题落到**具体文件行号或轨迹事件 ID**。

<p align="center">
  <a href="https://github.com/meiluosi/agent-composition-review">
    <img src="./assets/acr-boundary-anim.svg" alt="Agent指令消歧与LangGraph组合边界故障诊断示意" width="880" />
  </a>
  <br />
  <sub>指令消歧保真 + LangGraph 组合边界静态/轨迹诊断 · 点击查看 ACR</sub>
</p>

**状态：`agent-composition-review` 处于 v0.6.0 维护模式（功能已冻结，优先处理真实误报与兼容性，不宣称生产准确率）；消歧与保真检查在机械核对之外仍需结合上下文判断。**

[查看 Agent 组合边界诊断 (ACR)](https://github.com/meiluosi/agent-composition-review) · [看中文改写前后对照](https://github.com/meiluosi/zh-disambiguate-skill) · [查看改写保真检查](https://github.com/meiluosi/rewrite-fidelity-skill)

---

## 正在思考的未解之问 (Open Questions)

> *“我们不仅公开已经写下的代码与实验记录，更公开记录那些驱动着我们每天动手验证、尚未解决的本质困惑。”*

### 🤖 关于大模型、表征与认知界限
1. **压缩的尽头是高级模式检索，还是隐式世界模型？**  
   语言模型的自监督 Next-Token 预测在信息论上是对人类知识流形的高维有损压缩。然而，**这个压缩过程究竟在什么数学或几何临界点上，会从复杂的表面统计关联跃迁为具备反事实推断与因果外推能力的世界模型？** 我们能否用最小规模的受控合成数据环境，严格测量出这一相变边界？
2. **组合泛化（Compositionality）与离散符号的保真鸿沟：**  
   人类认知可以零样本把两个已知规则进行系统性组合，而 Transformer 在处理多步确定性逻辑与长程图遍历时，频现状态退化与概率漂移。**连续的高维向量嵌入空间，在数学上是否天生难以无损保证离散组合逻辑的严格保真？** 神经与符号的真正有机结合点究竟在哪？
3. **极度受限算力下的小模型极限：数据动力学 vs 参数规模**  
   在个人算力约束下（从 100K tiny 验证到 1B 本地模型），决定小模型逻辑能力的真正瓶颈究竟是参数容量，还是训练语料的几何拓扑与推理路径密度？小模型能否通过极高密度的精炼数据合成，突破通用大模型的 Scaling 垄断？

### 🦀 关于风力兽、具身形态与物理动力学
1. **形态计算的代偿极限：纯物理身体能“吃掉”多少计算？**  
   Jansen 连杆机构仅凭特定比例的刚性杆件几何，就在没有任何传感器和微控制器的情况下“计算”出了近似矩形的平稳步态。**但当面对未知、非平稳地形（如松软沙地、台阶与随机障碍）时，纯被动机械结构的自适应上限在哪里？** 要实现动态环境适应，必须引入的“最小主动神经控制回路”应该介入到连杆拓扑的哪个节点？
2. **极限环动力学（Limit Cycles）与符号推理的鸿沟：**  
   风力兽的迈步本质上是相空间中的物理动力学吸引子，是连续的、物理世界与身体的实时耦合；而主流 AI 偏好离散离线推理。**高层的离散目标规划，如何无缝映射到底层的连续动力学吸引子中，而不需要退化回机械式的逆运动学查表？**
3. **从机械连杆到自维持生命（Autopoiesis）的跨越：**  
   风力兽被称为“海滩上的机械生命”，但它仍然依赖预先确定的杆件，无法自我修复、自我供能与维持自身组织。**一个具备最小生命自主性（维持自身存在、产生内在动机）的物理系统，其不可削减的最小动力学与物质架构是什么？**

---

## FDE 实战与证据驱动交付系列

面向前线部署工程师（FDE / 售前 / 交付 / 顾问）的 7 个独立 Skill。各仓库零第三方 Python 依赖，通过手动读取的产物（行业图、问题定义卡、选型评测表、Demo 简报与试点方案）衔接，不强制捆绑安装。

<p align="center">
  <img src="./assets/fde-pipeline-anim.svg" alt="FDE证据驱动交付系列工作流：从行业速成、问题定义、路线选型、知识库诊断到客户Demo与事前登记试点，沟通贯穿全程" width="880" />
</p>

| 阶段与仓库 | 管什么 | 核心判据 / 产出 |
|---|---|---|
| [fde-ramp](https://github.com/meiluosi/fde-ramp) | 见客户前搭起行业基本盘，先画“会被改的图”再去被一线员工修正；含煤层气与网文行业包 | 全链路图、50 词行话小抄、待验证清单、自检分数 |
| [fde-problem-framing](https://github.com/meiluosi/fde-problem-framing) | 把客户诉求变成有证据边界的问题与竞争解释，同台比较流程、规则、传统软件与 AI | `Supported / Unknown / Unsupported` × `Proceed / Investigate / Non-AI / Stop-Defer` |
| [fde-route-selection](https://github.com/meiluosi/fde-route-selection) | 问题定义之后，先过滤合规与部署硬约束，再选适配路线，最后用客户样本比选模型质量、成本与延迟 | 约束门禁表、路线比选、客户样本 Bakeoff 计划 |
| [fde-knowledge-base](https://github.com/meiluosi/fde-knowledge-base) | 路线含文档检索（RAG）时，摸底真实文档状况、治理归属与原文兜底，按检索/生成/知识三层定位质量瓶颈 | 抽样摸底表（含 Wilson 区间）、四层任务评测集、`Proceed / Investigate / Pivot / Stop-Defer` |
| [fde-demo](https://github.com/meiluosi/fde-demo) | 把客户 Demo 当作验证与换取信任的沟通来设计：事前登记红线与信号，事后看客户**做了什么**而非说了什么 | 彩排审查、原话与解读分离的现场记录、三轴复盘判定 |
| [fde-pilot](https://github.com/meiluosi/fde-pilot) | 把通过 Demo 的方案做成**事前登记**试点，将人工复核与纠错计入业务指标，禁止事后替换指标 | 事前登记方案检查、期中预警、效应与 Bootstrap 区间报告 |
| [fde-comms](https://github.com/meiluosi/fde-comms) | 贯穿全周期的关键对话：把信息从人那里拿出来、把结论与坏消息送上去 | 会前访谈提纲、会后纪要与复述校准、高管一页纸、坏消息稿 |

## 研究、写作与内容工作流 Skills

我做的 [Claude](https://claude.ai) / Codex skill，按用途分组。每个仓库都有中英文说明、示例，以及对效果和边界的诚实评估。

### 可信实验与准确文字

| Skill | 做什么 |
|---|---|
| [research-writing-skills](https://github.com/meiluosi/research-writing-skills) | 由果蝇连接组项目提炼：预先登记实验协议、独立无上下文审查、文档级编辑、改写保真检查与路由 |
| [zh-disambiguate-skill](https://github.com/meiluosi/zh-disambiguate-skill) | 把简体中文改写成 agent 只有一种读法的文字，缺的信息变成向作者的提问；附零依赖 linter 与评测 |
| [rewrite-fidelity-skill](https://github.com/meiluosi/rewrite-fidelity-skill) | 检查改写有没有改变数字、字面量、条件、阈值方向（至少 vs 至多）、否定和语气强度（MUST/SHOULD/MAY） |

### 学习、规划、写作、做图（一条可选的链）

从学明白一项技术，到把它写出来、做成图文。每一环单独能用，也可以接起来用。

| Skill | 做什么 |
|---|---|
| [research-learning](https://github.com/meiluosi/research-learning) | 学习机器学习和大模型技术：五步讲课，每个论断标明是论文说的、推导的还是未检验的；验证和实验只在需要时才做 |
| [content-topic-decomposer](https://github.com/meiluosi/content-topic-decomposer) | 把一个主题拆成均衡的内容规划：五种内容类型 × 读者阶段 × 形式，以及一段经历的多种复用 |
| [human-in-the-loop-writing](https://github.com/meiluosi/human-in-the-loop-writing) | 用 AI 写作但不丢掉自己：研究、起草、五问体检、学习你的修改规则 |
| [content-card-designer](https://github.com/meiluosi/content-card-designer) | 把内容做成图文卡片、封面和头像：文字由浏览器排版、真实素材不经生成模型重绘，导出前先质检 |

## 写作与笔记

阅读、实验，以及做东西时遇到的问题。更多内容在 [meiluosi.github.io](https://meiluosi.github.io/)。

<!-- posts starts -->
### 最新文章

- [真实连线没测出优势：一个“负结果”项目到底留下了什么](https://meiluosi.github.io/posts/2026-10-21-fly-connectome-11-summary/) · 2026-10-21
- [审查抓到了什么：一份“怎么骗自己”的清单](https://meiluosi.github.io/posts/2026-10-21-fly-connectome-10-review-checklist/) · 2026-10-21
- [隔间与多巴胺：把效价专门化放进模型之后，得到了什么](https://meiluosi.github.io/posts/2026-10-21-fly-connectome-09-compartments-and-dopamine/) · 2026-10-21
- [三只果蝇的真实连线：共享的结构，大半是嗅小球层面的输入总量](https://meiluosi.github.io/posts/2026-10-21-fly-connectome-08-individual-differences/) · 2026-10-21
- [阳性对照与自然气味：能检出连线的作用，却没有测出它在自然气味上的优势](https://meiluosi.github.io/posts/2026-10-21-fly-connectome-07-positive-controls-natural-odours/) · 2026-10-21
<!-- posts ends -->

<!-- releases starts -->
### 最近发布

- [fde-problem-framing v0.3.0](https://github.com/meiluosi/fde-problem-framing/releases/tag/v0.3.0) · 2026-10-20 `pre`
- [agent-composition-review v0.6.0](https://github.com/meiluosi/agent-composition-review/releases/tag/v0.6.0) · 2026-10-17
- [rewrite-fidelity-skill v0.1.2](https://github.com/meiluosi/rewrite-fidelity-skill/releases/tag/v0.1.2) · 2026-10-14
- [zh-disambiguate-skill v0.1.2](https://github.com/meiluosi/zh-disambiguate-skill/releases/tag/v0.1.2) · 2026-10-14
<!-- releases ends -->

## 实验复盘与收敛记录

- [md-knowledge-graph：工程完成之后，为什么仍决定停止扩展？](https://github.com/meiluosi/md-knowledge-graph/blob/main/docs/retrospective.md) — 检查 Markdown 引用完整性与标签一致性；客观部分与 `lychee` 重叠，独有部分是工具发明的意见。项目已冻结、进入维护模式，保留代码、实际使用记录和复盘。
- [fly-connectome-study：当五条检验线都没有测出真实连线优势，我们能说什么、不能说什么？](https://github.com/meiluosi/fly-connectome-study/blob/main/FINAL_SUMMARY.md) — 保留全部阴性结果、对照缺陷分析与元学习参数化更正记录。

## 联系

- **邮箱** — [1160337988@qq.com](mailto:1160337988@qq.com)
- **站内** — [meiluosi.github.io/contact](https://meiluosi.github.io/contact/)
- **可以一起聊聊** — 论文讨论与实验复现 · 因果推理与效果评估 · Agent、科研系统与 RSI

---

<sub>代表作品与状态人工维护；最新文章、最近发布由 [构建脚本](./build_readme.mjs) 自动更新，数据源不可用时保留上次内容。英文门面见 [README.en.md](./README.en.md)。</sub>
