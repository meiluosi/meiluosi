# 枫语 / Feng Yu

**研究 AI，也做工具和仿真。把过程、结果和局限一起写下来。**

我关心模型怎样学习、指令怎样被准确理解，以及一个想法怎样变成可以动手验证的东西。

[个人网站](https://meiluosi.github.io/) · [研究笔记](https://meiluosi.github.io/notes/) · [实验室](https://meiluosi.github.io/lab/)

## 最近在做

### 风力兽实验室

调整连杆，观察步态，探索设计、仿真与制造之间的关系。已有连杆编辑器、仿真回放和打印包导出。

**状态：alpha；尚未用真实硬件验证。**

[看演示与源码](https://github.com/meiluosi/strandbeest-evolution)

### 让 Agent 少误读一点

用中文消歧工具澄清执行者、条件和边界，再用改写保真工具检查数字、字面量、否定和语气有没有被改变。机械检查之外仍需结合上下文判断。

[看中文改写前后对照](https://github.com/meiluosi/zh-disambiguate-skill) · [查看改写保真检查](https://github.com/meiluosi/rewrite-fidelity-skill)

### 从零跑通小模型训练流程

在个人电脑上连接数据、分词、随机初始化预训练、SFT、DPO、评测与本地推理，并留下保存恢复和运行记录。

**状态：已完成 138,560 参数 tiny 模型的工程验证；尚不代表实用语言能力，30M 及以上仍待训练。**

[看实现与实验记录](https://github.com/meiluosi/meiluosi.github.io/tree/master/projects/small-model-lab) · [打开模型工作台](https://meiluosi.github.io/lab/model-pipeline/)

## 写作与笔记

阅读、实验，以及做东西时遇到的问题。更多内容在 [meiluosi.github.io](https://meiluosi.github.io/)。

<!-- posts starts -->
### 最新文章

- [从数据到部署：在 Mac 上规划小模型全链路训练](https://meiluosi.github.io/posts/2026-07-08-1b%E6%A8%A1%E5%9E%8B%E5%85%A8%E9%93%BE%E8%B7%AF%E5%AE%9E%E9%AA%8C%E8%AE%A1%E5%88%92/) · 2026-07-08
- [LLM推理优化与部署](https://meiluosi.github.io/posts/2024-10-27-llm%E6%8E%A8%E7%90%86%E4%BC%98%E5%8C%96%E4%B8%8E%E9%83%A8%E7%BD%B2/) · 2024-10-27
- [多模态大模型技术](https://meiluosi.github.io/posts/2024-10-20-%E5%A4%9A%E6%A8%A1%E6%80%81%E5%A4%A7%E6%A8%A1%E5%9E%8B%E6%8A%80%E6%9C%AF/) · 2024-10-20
<!-- posts ends -->

<!-- releases starts -->
### 最近发布

- [rewrite-fidelity-skill v0.1.1](https://github.com/meiluosi/rewrite-fidelity-skill/releases/tag/v0.1.1) · 2026-10-05
- [zh-disambiguate-skill v0.1.1](https://github.com/meiluosi/zh-disambiguate-skill/releases/tag/v0.1.1) · 2026-10-05
<!-- releases ends -->

## 实验复盘

[md-knowledge-graph：工程完成之后，为什么仍决定停止扩展？](https://github.com/meiluosi/md-knowledge-graph/blob/main/docs/retrospective.md)  
项目已冻结、进入维护模式；保留代码、实际使用记录和复盘。

---

<sub>代表作品与状态人工维护；最新文章、最近发布由 [构建脚本](./build_readme.mjs) 自动更新。数据源不可用时保留上次内容。</sub>

