import { Injectable } from '@nestjs/common';
import { WidgetConfigDto, WidgetResponseDto } from './dto/widget-config.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UniversityService {
  private widgetStore = new Map<string, WidgetConfigDto>();

  async generateWidget(config: WidgetConfigDto): Promise<WidgetResponseDto> {
    const widgetId = uuidv4();
    
    // Store widget configuration
    this.widgetStore.set(widgetId, config);
    
    // Generate iframe codes for different formats
    const iframeFormats = this.generateIframeFormats(widgetId);
    
    // Generate preview URL
    const previewUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/university/widget/${widgetId}`;
    
    return {
      iframeCode: iframeFormats.html, // Keep backward compatibility
      iframeFormats,
      previewUrl,
      widgetId,
    };
  }

  async getWidgetConfig(widgetId: string): Promise<WidgetConfigDto | null> {
    return this.widgetStore.get(widgetId) || null;
  }

  private generateIframeFormats(widgetId: string): any {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    const widgetUrl = `${baseUrl}/university/widget/${widgetId}`;
    
    return {
      html: `<iframe 
  src="${widgetUrl}" 
  width="auto" 
  height="300" 
  frameborder="0" 
  scrolling="no"
  style="border: none; position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 9999; min-width: 44px; max-width: 400px;"
  title="University Navigation Widget">
</iframe>`,
      
      react: `<iframe 
  src="${widgetUrl}" 
  width="auto" 
  height="300" 
  frameBorder="0" 
  scrolling="no"
  style={{
    border: 'none',
    position: 'fixed',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 9999,
    minWidth: '44px',
    maxWidth: '400px'
  }}
  title="University Navigation Widget"
/>`,
      
      vue: `<iframe 
  :src="'${widgetUrl}'" 
  width="auto" 
  height="300" 
  frameborder="0" 
  scrolling="no"
  :style="{
    border: 'none',
    position: 'fixed',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 9999,
    minWidth: '44px',
    maxWidth: '400px'
  }"
  title="University Navigation Widget">
</iframe>`,
      
      angular: `<iframe 
  [src]="'${widgetUrl}'" 
  width="auto" 
  height="300" 
  frameborder="0" 
  scrolling="no"
  [style]="{
    'border': 'none',
    'position': 'fixed',
    'right': '20px',
    'top': '50%',
    'transform': 'translateY(-50%)',
    'z-index': '9999',
    'min-width': '44px',
    'max-width': '400px'
  }"
  title="University Navigation Widget">
</iframe>`,
      
      wordpress: `<!-- Add this to your WordPress theme's footer.php or use a plugin -->
<iframe 
  src="${widgetUrl}" 
  width="auto" 
  height="300" 
  frameborder="0" 
  scrolling="no"
  style="border: none; position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 9999; min-width: 44px; max-width: 400px;"
  title="University Navigation Widget">
</iframe>`,
      
      shopify: `<!-- Add this to your Shopify theme's layout/theme.liquid file before </body> -->
<iframe 
  src="${widgetUrl}" 
  width="auto" 
  height="300" 
  frameborder="0" 
  scrolling="no"
  style="border: none; position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 9999; min-width: 44px; max-width: 400px;"
  title="University Navigation Widget">
</iframe>`
    };
  }

  private generateIframeCode(widgetId: string): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    const widgetUrl = `${baseUrl}/university/widget/${widgetId}`;
    
    return `<iframe 
  src="${widgetUrl}" 
  width="auto" 
  height="300" 
  frameborder="0" 
  scrolling="no"
  style="border: none; position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 9999; min-width: 44px; max-width: 400px;"
  title="University Navigation Widget">
</iframe>`;
  }

  generateWidgetHTML(config: WidgetConfigDto): string {
    const { selectedIcons = [], selectedColor = '#131e42', iconInputs = {} } = config;
    
    // SVG icon mapping (exact same as your Lucide icons)
    const iconMap: { [key: string]: string } = {
      "Home": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
      "User": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      "Mail": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 5L2 7"/></svg>`,
      "Phone": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
      "Calendar": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
      "FileText": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>`,
      "Book": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      "Settings": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
      "Globe": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      "HelpCircle": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
      "Send": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22,2 15,22 11,13 2,9 22,2"/></svg>`,
      "Chat": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`
    };

    // Build rail icons array (same logic as your frontend)
    const alwaysShowIcons = ["Chat"];
    const filteredSelectedIcons = selectedIcons.filter(icon => !alwaysShowIcons.includes(icon));
    const maxIcons = 5;
    const iconsToAdd = Math.min(filteredSelectedIcons.length, maxIcons - alwaysShowIcons.length);
    
    const railIcons: Array<{name: string, icon: string, label: string, url: string}> = [];
    
    // Add selected icons first
    filteredSelectedIcons.slice(0, iconsToAdd).forEach(iconName => {
      const iconInput = iconInputs[iconName];
      const icon = iconMap[iconName] || iconMap["Chat"];
      const label = iconInput?.label || iconName;
      const url = iconInput?.url || '#';
      railIcons.push({ name: iconName, icon, label, url });
    });
    
    // Add always show icons at the end
    alwaysShowIcons.forEach(iconName => {
      const iconInput = iconInputs[iconName];
      const icon = iconMap[iconName];
      const label = iconInput?.label || iconName;
      const url = iconInput?.url || '#';
      railIcons.push({ name: iconName, icon, label, url });
    });

    // Calculate dynamic height (same as your frontend)
    const iconCount = railIcons.length;
    const baseHeight = 60;
    const iconSpacing = 40;
    const dynamicHeight = baseHeight + (iconCount - 1) * iconSpacing;

    // Build icon HTML
    const iconsHTML = railIcons.map(({ name, icon, label, url }) => `
      <div class="widget-icon" data-tooltip="${label}">
        <a href="${url}" target="_blank" rel="noopener noreferrer">
          ${icon}
        </a>
      </div>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Widget Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      height: 100%;
      width: 100%;
      background: transparent;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .widget-container {
      position: relative;
      width: 44px;
      height: ${dynamicHeight}px;
      border-radius: 720px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid ${selectedColor};
      backdrop-filter: blur(35px);
      -webkit-backdrop-filter: blur(35px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      padding: 6px;
      transition: height 0.3s ease-in-out;
      margin: 0 auto;
    }
    
    .widget-wrapper {
      position: relative;
      display: inline-block;
      min-width: 44px;
      max-width: 400px;
      width: auto;
    }
    
    .widget-icon {
      position: relative;
      width: 32px;
      height: 32px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
    }
    
    .widget-icon:hover {
      background: #439EFF;
    }
    
    .widget-icon a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      text-decoration: none;
      color: ${selectedColor};
    }
    
    .widget-icon svg {
      width: 18px;
      height: 18px;
    }
    
    .tooltip {
      position: absolute;
      right: calc(100% + 12px);
      top: 50%;
      transform: translateY(-50%);
      height: 28px;
      min-width: 101px;
      border-radius: 21px;
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid ${selectedColor};
      backdrop-filter: blur(35px);
      -webkit-backdrop-filter: blur(35px);
      color: ${selectedColor};
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      z-index: 10;
      transition: opacity 0.2s ease-in-out;
      font-weight: 400;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    
    .widget-icon:hover .tooltip {
      opacity: 1;
      visibility: visible;
    }
  </style>
</head>
<body>
  <div class="widget-wrapper">
    <div class="widget-container">
      ${iconsHTML}
    </div>
  </div>
  
  <script>
    // Add tooltip functionality and dynamic width adjustment
    document.addEventListener('DOMContentLoaded', function() {
      const icons = document.querySelectorAll('.widget-icon');
      let maxTooltipWidth = 0;
      
      icons.forEach(icon => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = icon.getAttribute('data-tooltip');
        icon.appendChild(tooltip);
        
        // Measure tooltip width when visible
        icon.addEventListener('mouseenter', function() {
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
          const tooltipWidth = tooltip.offsetWidth;
          if (tooltipWidth > maxTooltipWidth) {
            maxTooltipWidth = tooltipWidth;
            // Adjust iframe width dynamically
            const iframe = window.parent.document.querySelector('iframe[src*="university/widget"]');
            if (iframe) {
              const newWidth = Math.min(44 + maxTooltipWidth + 24, 400); // 44px widget + tooltip + 24px padding
              iframe.style.width = newWidth + 'px';
            }
          }
        });
        
        icon.addEventListener('mouseleave', function() {
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        });
      });
    });
  </script>
</body>
</html>`;
  }
}
