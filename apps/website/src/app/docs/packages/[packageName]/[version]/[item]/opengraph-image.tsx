/* eslint-disable react/no-unknown-property */

import { ImageResponse } from 'next/og';
import { resolveKind } from '@/util/resolveNodeKind';

export const runtime = 'edge';

export const size = {
	width: 1_200,
	height: 630,
};

export const contentType = 'image/png';

export default async function Image({
	params,
}: {
	readonly params: Promise<{ readonly item: string; readonly packageName: string; readonly version: string }>;
}) {
	const { item, packageName, version } = await params;

	const [fontDataBold, fontDataBlack] = await Promise.all([
		fetch(new URL('../../../../../../assets/Geist-Bold.ttf', import.meta.url), {
			next: { revalidate: 604_800 },
		}).then(async (res) => res.arrayBuffer()),
		fetch(new URL('../../../../../../assets/Geist-Black.ttf', import.meta.url), {
			next: { revalidate: 604_800 },
		}).then(async (res) => res.arrayBuffer()),
	]);
	const normalizeItem = item.split(encodeURIComponent(':')).join('.').toLowerCase();

	const isMain = version === 'main';
	const fileContent = await fetch(
		`${process.env.BLOB_STORAGE_URL}/rewrite/${packageName}/${version}.${normalizeItem}.api.json`,
		{ next: { revalidate: isMain ? 0 : 604_800 } },
	);
	const node = await fileContent.json();

	return new ImageResponse(
		(
			<div tw="flex bg-[#121212] h-full w-full p-14">
				<div tw="flex flex-col mx-auto h-full text-white">
					<div tw="flex text-4xl text-gray-400">{packageName}</div>
					<div tw="flex flex-col justify-between h-full w-full pt-14">
						<div tw="flex items-center max-w-full">
							<span tw="mr-6">{resolveKind(node.kind, 94)}</span>
							<h2
								style={{
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
								}}
								tw="text-[5.5rem] font-bold w-full"
							>
								{node.displayName}
							</h2>
						</div>
						<div tw="flex flex-row w-full justify-between">
							<div tw="flex flex-row">
								{node.members?.properties?.length ? (
									<div tw="flex mr-12">
										<span tw="mr-4">{resolveKind('Property', 42)}</span>
										<div tw="flex flex-col text-4xl">
											<span tw="mb-4">{node.members.properties.length}</span>
											<span>Properties</span>
										</div>
									</div>
								) : null}
								{node.members?.events?.length ? (
									<div tw="flex mr-12">
										<span tw="mr-4">{resolveKind('Method', 42)}</span>
										<div tw="flex flex-col text-4xl">
											<span tw="mb-4">{node.members.events.length}</span>
											<span>Events</span>
										</div>
									</div>
								) : null}
								{node.members?.methods?.length ? (
									<div tw="flex mr-12">
										<span tw="mr-4">{resolveKind('Method', 42)}</span>
										<div tw="flex flex-col text-4xl">
											<span tw="mb-4">{node.members.methods.length}</span>
											<span>Methods</span>
										</div>
									</div>
								) : null}
								{node.members?.length ? (
									<div tw="flex">
										<span tw="mr-4">{resolveKind('EnumMember', 42)}</span>
										<div tw="flex flex-col text-4xl">
											<span tw="mb-4">{node.members.length}</span>
											<span>Members</span>
										</div>
									</div>
								) : null}
							</div>
							<div tw="flex h-full items-end">
								<span tw="bg-[#5865f2] text-4xl font-black relative rounded-lg py-4 px-8">discord.js</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		),
		{
			...size,
			fonts: [
				{
					name: 'Geist',
					data: fontDataBold,
					weight: 700,
					style: 'normal',
				},
				{
					name: 'Geist',
					data: fontDataBlack,
					weight: 900,
					style: 'normal',
				},
			],
		},
	);
}
