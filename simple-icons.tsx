import {addPropertyControls, ControlType} from 'framer';
import React, {useState, useEffect, useRef} from 'react';
import * as icons from 'simple-icons';

// Prepare icons data
const iconSlugs: string[] = [];
const iconNames: string[] = [];
for (const icon of Object.values(icons)) {
	iconSlugs.push(icon.slug as string);
	iconNames.push(icon.title as string);
}

const getIconKey = (slug: string) => {
	return ('si' +
		slug.charAt(0).toUpperCase() +
		slug.slice(1)) as keyof typeof icons;
};

const getIconBrandColor = (slug: string) => {
	const icon = icons[getIconKey(slug)];
	return '#' + (icon.hex as string);
};

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function SimpleIcons({
	icon = 'framer',
	color = 'brand',
	customColor = '#757575',
}: {
	icon?: string;
	color?: string;
	customColor?: string;
}): JSX.Element {
	// Fetch icon SVG from jsDelivr.
	// This is used instead of cdn.simpleicons.org because it has CORS errors when fetching.
	const url = `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${icon}.svg`;
	const [svgElement, setSvgElement] = useState<HTMLElement>();
	const svgRef = useRef<HTMLDivElement>(null);
	const brandColor = getIconBrandColor(icon);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetch(url)
			.then(async (response) => response.text())
			.then((data) => {
				const parser = new DOMParser();
				const svgDoc = parser.parseFromString(data, 'image/svg+xml');
				setSvgElement(svgDoc.documentElement);
				console.log(svgElement);
			});
	}, [url]);

	useEffect(() => {
		if (svgElement) {
			const existingSvgElement = svgRef.current?.querySelector('svg');
			if (existingSvgElement) {
				existingSvgElement.remove();
			}

			Object.assign(svgElement.style, {
				fill: color === 'custom' ? customColor : brandColor,
			});
			svgRef.current?.append(svgElement);
		}
	}, [svgElement]);

	useEffect(() => {
		if (svgElement) {
			Object.assign(svgElement.style, {
				fill: color === 'custom' ? customColor : brandColor,
			});
		}
	}, [color, customColor]);

	return <div ref={svgRef} />;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
addPropertyControls(SimpleIcons, {
	icon: {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		type: ControlType.Enum,
		defaultValue: 'framer',
		description:
			'Find every icon name on the [Simple Icons site](https://simpleicons.org/)',
		options: iconSlugs,
		optionTitles: iconNames,
	},
	color: {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		type: ControlType.Enum,
		defaultValue: 'brand',
		options: ['brand', 'custom'],
		optionTitles: ['Brand', 'Custom'],
		displaySegmentedControl: true,
	},
	customColor: {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		type: ControlType.Color,
		defaultValue: '#757575',
		title: 'Custom',
		hidden({color}) {
			return color !== 'custom';
		},
	},
});
