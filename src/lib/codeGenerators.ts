import { WidgetConfig } from './widgetUtils';
import { generateWidgetCode } from './widgetUtils';

export type ExportFormat = 'html' | 'react' | 'wordpress' | 'vue' | 'angular' | 'svelte' | 'flutter' | 'django' | 'laravel' | 'aspnet' | 'shopify';

export const generateCodeByFormat = (config: WidgetConfig, format: ExportFormat): string => {
  switch (format) {
    case 'react':
      return generateReactCode(config);
    case 'wordpress':
      return generateWordPressCode(config);
    case 'vue':
      return generateVueCode(config);
    case 'angular':
      return generateAngularCode(config);
    case 'svelte':
      return generateSvelteCode(config);
    case 'flutter':
      return generateFlutterCode(config);
    case 'django':
      return generateDjangoCode(config);
    case 'laravel':
      return generateLaravelCode(config);
    case 'aspnet':
      return generateAspNetCode(config);
    case 'shopify':
      return generateShopifyCode(config);
    default:
      return generateWidgetCode(config);
  }
};

export const generateReactCode = (config: WidgetConfig): string => {
  const widgetCode = generateWidgetCode(config);
  return `import React, { useEffect } from 'react';

const ${config.type.charAt(0).toUpperCase() + config.type.slice(1)}Widget = () => {
  useEffect(() => {
    // Widget initialization code
    ${widgetCode.includes('<script>') ? widgetCode.split('<script>')[1].split('</script>')[0] : ''}
  }, []);

  return (
    <div dangerouslySetInnerHTML={{
      __html: \`${widgetCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
    }} />
  );
};

export default ${config.type.charAt(0).toUpperCase() + config.type.slice(1)}Widget;`;
};

export const generateWordPressCode = (config: WidgetConfig): string => {
  const widgetCode = generateWidgetCode(config);
  return `<?php
/**
 * Plugin Name: ${config.type.charAt(0).toUpperCase() + config.type.slice(1)} Widget
 * Description: A customizable ${config.type} widget for WordPress
 * Version: 1.0
 */

function add_${config.type.replace('-', '_')}_widget() {
    ?>
    ${widgetCode}
    <?php
}

add_action('wp_footer', 'add_${config.type.replace('-', '_')}_widget');
?>`;
};

export const generateVueCode = (config: WidgetConfig): string => {
  const widgetCode = generateWidgetCode(config);
  const scriptContent = widgetCode.includes('<script>') ? widgetCode.split('<script>')[1].split('</script>')[0] : '';
  return `<template>
  <div v-html="widgetHtml"></div>
</template>

<script>
export default {
  name: '${config.type.charAt(0).toUpperCase() + config.type.slice(1)}Widget',
  data() {
    return {
      widgetHtml: \`${widgetCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
    }
  },
  mounted() {
    ${scriptContent}
  }
}
</script>

<style scoped>
/* Widget styles are included in the HTML */
</style>`;
};

export const generateAngularCode = (config: WidgetConfig): string => {
  const widgetCode = generateWidgetCode(config);
  const componentName = config.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  return `import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-${config.type}-widget',
  template: \`<div [innerHTML]="widgetHtml"></div>\`,
  styles: []
})
export class ${componentName}WidgetComponent implements OnInit {
  widgetHtml: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    this.widgetHtml = this.sanitizer.bypassSecurityTrustHtml(\`${widgetCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  }

  ngOnInit(): void {
    ${widgetCode.includes('<script>') ? '// Widget initialization' : ''}
  }
}`;
};

export const generateSvelteCode = (config: WidgetConfig): string => {
  const widgetCode = generateWidgetCode(config);
  const scriptContent = widgetCode.includes('<script>') ? widgetCode.split('<script>')[1].split('</script>')[0] : '';
  return `<script>
  import { onMount } from 'svelte';
  
  let widgetHtml = \`${widgetCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
  
  onMount(() => {
    ${scriptContent}
  });
</script>

<div>
  {@html widgetHtml}
</div>

<style>
  /* Widget styles are included in the HTML */
</style>`;
};

export const generateFlutterCode = (config: WidgetConfig): string => {
  return `import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class ${config.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Widget extends StatefulWidget {
  @override
  _${config.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}WidgetState createState() => 
    _${config.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}WidgetState();
}

class _${config.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}WidgetState 
    extends State<${config.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Widget> {
  late final WebViewController controller;

  @override
  void initState() {
    super.initState();
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadHtmlString('''
        ${generateWidgetCode(config).replace(/'/g, "\\'")}
      ''');
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 80,
      width: 80,
      child: WebViewWidget(controller: controller),
    );
  }
}`;
};

export const generateDjangoCode = (config: WidgetConfig): string => {
  const widgetCode = generateWidgetCode(config);
  return `{% comment %}
  ${config.type.charAt(0).toUpperCase() + config.type.slice(1)} Widget Template
  Usage: {% include '${config.type}_widget.html' %}
{% endcomment %}

${widgetCode}

{% comment %}
  To use this widget:
  1. Save this file as templates/${config.type}_widget.html
  2. Include it in your template: {% include '${config.type}_widget.html' %}
  3. Or load it as safe HTML: {{ widget_html|safe }}
{% endcomment %}`;
};

export const generateLaravelCode = (config: WidgetConfig): string => {
  const widgetCode = generateWidgetCode(config);
  return `{{-- ${config.type.charAt(0).toUpperCase() + config.type.slice(1)} Widget Blade Template --}}
{{-- Usage: @include('widgets.${config.type}') --}}

{!! $widgetHtml ?? '${widgetCode.replace(/'/g, "\\'")}' !!}

{{--
  To use this widget:
  1. Save this file as resources/views/widgets/${config.type}.blade.php
  2. Include it in your blade template: @include('widgets.${config.type}')
  3. Or pass HTML from controller: return view('page', ['widgetHtml' => $html]);
--}}`;
};

export const generateAspNetCode = (config: WidgetConfig): string => {
  const widgetCode = generateWidgetCode(config);
  return `@* ${config.type.charAt(0).toUpperCase() + config.type.slice(1)} Widget Razor Component *@
@* Usage: <partial name="_${config.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Widget" /> *@

@{
    var widgetHtml = @"${widgetCode.replace(/"/g, '\\"')}";
}

@Html.Raw(widgetHtml)

@*
  To use this widget:
  1. Save this file as Views/Shared/_${config.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Widget.cshtml
  2. Include it in your view: <partial name="_${config.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Widget" />
  3. Or use: @await Html.PartialAsync("_${config.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Widget")
*@`;
};

export const generateShopifyCode = (config: WidgetConfig): string => {
  const widgetCode = generateWidgetCode(config);
  return `{% comment %}
  ${config.type.charAt(0).toUpperCase() + config.type.slice(1)} Widget for Shopify
  Usage: {% include '${config.type}-widget' %}
{% endcomment %}

${widgetCode}

{% comment %}
  To use this widget:
  1. Go to Shopify Admin > Online Store > Themes > Actions > Edit code
  2. Create a new snippet: snippets/${config.type}-widget.liquid
  3. Paste this code and save
  4. Include in your theme: {% include '${config.type}-widget' %}
  5. Common locations: theme.liquid, product.liquid, or page templates
{% endcomment %}`;
};

export const getFileExtension = (format: ExportFormat): string => {
  const extensions: Record<ExportFormat, string> = { 
    html: 'html', 
    react: 'jsx', 
    wordpress: 'php',
    vue: 'vue',
    angular: 'ts',
    svelte: 'svelte',
    flutter: 'dart',
    django: 'html',
    laravel: 'blade.php',
    aspnet: 'cshtml',
    shopify: 'liquid'
  };
  return extensions[format];
};

export const getMimeType = (format: ExportFormat): string => {
  const mimeTypes: Record<ExportFormat, string> = { 
    html: 'text/html', 
    react: 'text/javascript', 
    wordpress: 'text/plain',
    vue: 'text/plain',
    angular: 'text/typescript',
    svelte: 'text/plain',
    flutter: 'text/plain',
    django: 'text/html',
    laravel: 'text/plain',
    aspnet: 'text/plain',
    shopify: 'text/plain'
  };
  return mimeTypes[format];
};
