# Jdate
```
<link href="jdate.css" rel="stylesheet" />
<script src="Jdate.js"></script>


```

```
  /**
   * 手动绑定控件
   * @param seletor
   */
  static render(seletor?: Element) {
      seletor = seletor || document.body;
      let nodes = seletor.querySelectorAll(this.selector);
      nodes.forEach((node: any) => {
          !node.onclick && (node.onclick = this.listener.bind(this), node.setAttribute('render', ''))
      })
  }

  Jdate.render();
  OR
  Jdate.render(document.body);
```
