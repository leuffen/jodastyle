---
layout: article
permalink: /
title: Home
---




# JodaStyle Header 1

JodaStyle will 

[<icon: bi bi-emoji-smile>]


## JodaShorts

Wrap Markdown content like `[i .bi bi-pen]` in `<i class="bi bi-pen"></i>`.


## Split Sections

JodaStyle will split flat h1,h2,h3 Sections into a tree-like dom structure.


### Original
{: .columnize}

```
Pre Text











# Section 1

Section content














## Section 2

Section Content









### SubSection1.1.1

Section Content














### SubSection1.1.1

Section Content















## Section1.1

Section Content

```
{: #source}

### After Split
{: .columnize}



<div class="debug"><div class="joda-visualize">&lt;div  class=""&gt;</div><section class="section-h1pre"><div class="joda-visualize">&lt;section  class="section-h1pre"&gt;</div><div class="content"><div class="joda-visualize">&lt;div  class="content"&gt;</div><p>Pre Text<div class="joda-visualize">&lt;p  class=""&gt;</div></p></div></section><section class="section-h1" style=""><div class="joda-visualize">&lt;section  class="section-h1"&gt;</div><div class="content"><div class="joda-visualize">&lt;div  class="content"&gt;</div><h1 id="section-1">Section 1<div class="joda-visualize">&lt;h1  class=""&gt;</div></h1><p>Section content<div class="joda-visualize">&lt;p  class=""&gt;</div></p></div></section><section class="section-h2" style=""><div class="joda-visualize">&lt;section  class="section-h2"&gt;</div><div class="content"><div class="joda-visualize">&lt;div  class="content"&gt;</div><h2 id="subsection11">SubSection1.1<div class="joda-visualize">&lt;h2  class=""&gt;</div></h2><p>Section Content<div class="joda-visualize">&lt;p  class=""&gt;</div></p></div><div class="children"><div class="joda-visualize">&lt;div  class="children"&gt;</div><div class="section-h3" style=""><div class="joda-visualize">&lt;div  class="section-h3"&gt;</div><div class="content"><div class="joda-visualize">&lt;div  class="content"&gt;</div><h3 id="subsubsection111">SubSubSection1.1.1<div class="joda-visualize">&lt;h3  class=""&gt;</div></h3><p>Section Content<div class="joda-visualize">&lt;p  class=""&gt;</div></p></div></div><div class="section-h3" style=""><div class="joda-visualize">&lt;div  class="section-h3"&gt;</div><div class="content"><div class="joda-visualize">&lt;div  class="content"&gt;</div><h3 id="subsubsection111-1">SubSubSection1.1.1<div class="joda-visualize">&lt;h3  class=""&gt;</div></h3><p>Section Content<div class="joda-visualize">&lt;p  class=""&gt;</div></p></div></div></div></section><section class="section-h2" style=""><div class="joda-visualize">&lt;section  class="section-h2"&gt;</div><div class="content"><div class="joda-visualize">&lt;div  class="content"&gt;</div><h2 id="subsection11-1">SubSection1.1<div class="joda-visualize">&lt;h2  class=""&gt;</div></h2><p>Section Content<div class="joda-visualize">&lt;p  class=""&gt;</div></p></div></section></div>


## CSSPlus

Modify DOM Structure with CSSPlus.


| Command                              | Description                                                                                       |
|--------------------------------------|---------------------------------------------------------------------------------------------------|
| `--joda-wrap: @class1;`              | Wrap the element in a div with class1                                                             |
| `--joda-wrap: #id;`                  | Wrap the element in slot element of template with id                                              |
| `--joda-container: @class;`          | Create Contaier for all Sub-Elements                                                              |
| `--joda-group: @row;`                | Wrap element and siblings with same wrap-row into this element                                    |
| `--joda-class: @col;`                | Add a Class to this element                                                                       |
| `--roda-replace-by: @class;`         | Replace the entire Element with this element                                                      |
| `--joda-use: method(<json layout>);` | Wrap this element with interactive Wrapper function. It will evaluate `--layout-<name>` Variables |
| `--joda-unwrap: true;`               | Remove this element from the DOM                                                                  |

## Minitemplate

Minitemplates will replace any occurence of `[mini_tpl_name: value]` with the tempates value.

## Examples

### Shorts in Markdown

```
Hello World [bi: bi-emoji-smile]
```

### Grouping elements with CSSPlus

Create a wrapper Element `<div class="row">` around all elements with class `column`.

```css
.column {
    --joda-group: @row;
}
```
