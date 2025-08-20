<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { ChevronsRight, CircleQuestionMark } from '@lucide/svelte';

	// 입력 변수들
	let totalHours = $state('0'); // 현재까지의 총 근로 시간 (시)
	let totalMinutes = $state('0'); // 현재까지의 총 근로 시간 (분)
	let totalWorkHours = $state('0'); // 이번 달 총 근로 시간 (시간 단위만)
	let totalDays = $state(0); // 현재까지의 근로 일수

	// 계산 결과 변수들
	let totalWorkDays = $state(0); // 이번 달 총 근로 일수
	let overWorkMinutes = $state(0); // 초과 근로 시간 (분)
	let remainingDayAvgTime = $state({ hours: 0, minutes: 0 }); // 잔여일 평균 근로 시간
	let distributionInfo = $state(''); // 분 분배 정보

	// 시간:분을 총 분으로 변환
	function timeToMinutes(hours: string, minutes: string): number {
		const h = parseInt(hours) || 0;
		const m = parseInt(minutes) || 0;
		return h * 60 + m;
	}

	// 총 분을 시간:분으로 변환
	function minutesToTime(totalMinutes: number): { hours: number; minutes: number } {
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return { hours, minutes };
	}

	function calculate() {
		const totalWorkMinutesNum = timeToMinutes(totalHours, totalMinutes);
		const totalWorkHoursNum = parseInt(totalWorkHours) || 0;

		// 이번 달 총 근로 일수 (총 근로 시간 / 8)
		totalWorkDays = totalWorkHoursNum / 8;

		// 초과 근로 시간 (분 단위)
		const standardWorkMinutes = totalDays * 480; // 표준 근로시간 (8시간 × 일수)
		overWorkMinutes = totalWorkMinutesNum - standardWorkMinutes;

		// 잔여일 평균 근로 시간 계산 (8시간 + 초과근로시간/잔여일수)
		const remainingDays = totalWorkDays - totalDays;

		if (remainingDays > 0) {
			const avgOverWorkMinutesPerDay = overWorkMinutes / remainingDays;
			const totalAvgMinutesPerDay = 480 - avgOverWorkMinutesPerDay; // 8시간(480분) - 초과분

			const baseHours = Math.floor(totalAvgMinutesPerDay / 60);
			const baseMinutes = Math.floor(totalAvgMinutesPerDay % 60);
			const remainingMinutesToDistribute = overWorkMinutes % remainingDays;

			if (remainingMinutesToDistribute > 0) {
				// 남은 분을 특정 일에 분배
				const daysWithExtraMinute = remainingMinutesToDistribute;
				const daysWithoutExtraMinute = remainingDays - remainingMinutesToDistribute;
				distributionInfo = `${daysWithExtraMinute}일은 ${baseHours}시간 ${baseMinutes + 1}분, ${daysWithoutExtraMinute}일은 ${baseHours}시간 ${baseMinutes}분`;
			} else {
				distributionInfo = '';
			}

			remainingDayAvgTime = minutesToTime(Math.floor(totalAvgMinutesPerDay));
		} else {
			remainingDayAvgTime = { hours: 8, minutes: 0 }; // 잔여일이 없으면 기본 8시간
			distributionInfo = '';
		}
	}
</script>

<Tooltip.Provider>
	<div class="flex items-center justify-center p-6">
		<div class="w-full max-w-2xl space-y-6">
			<!-- 메인 타이틀 -->
			<div class="space-y-2 text-center">
				<h1 class="text-4xl font-bold text-slate-900 dark:text-slate-100">
					얼마나 일해야 하지? 👀
				</h1>
				<p class="text-slate-600 dark:text-slate-400">정확한 근로시간 관리를 위한 계산기입니다</p>
			</div>

			<!-- 입력 폼 카드 -->
			<Card class="w-full">
				<CardHeader>
					<CardTitle class="text-xl">근로시간 정보 입력</CardTitle>
				</CardHeader>
				<CardContent class="space-y-6">
					<div class="space-y-4">
						<div class="space-y-2">
							<Label
								>현재까지의 총 근로 시간
								<Tooltip.Root>
									<Tooltip.Trigger>
										<CircleQuestionMark class="h-4 w-4 text-gray-400 hover:text-gray-600" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>네이버 웍스 근로시간 현황의 이번달 일반 근로시간을 넣어주세요.</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Label>
							<div class="flex items-center gap-2">
								<Input
									type="number"
									placeholder="시간"
									bind:value={totalHours}
									class="flex-1"
									min="0"
								/>
								<span class="text-slate-600 dark:text-slate-400">시간</span>
								<Input
									type="number"
									placeholder="분"
									bind:value={totalMinutes}
									class="flex-1"
									min="0"
									max="59"
								/>
								<span class="text-slate-600 dark:text-slate-400">분</span>
							</div>
						</div>

						<div class="space-y-2">
							<Label for="totalWorkHours"
								>이번 달 총 근로 시간
								<Tooltip.Root>
									<Tooltip.Trigger>
										<CircleQuestionMark class="h-4 w-4 text-gray-400 hover:text-gray-600" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>이번달 배정된 총 근로시간을 넣어주세요.</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Label>
							<div class="flex items-center gap-2">
								<Input
									id="totalWorkHours"
									type="number"
									placeholder="시간"
									bind:value={totalWorkHours}
									class="flex-1"
									min="0"
								/>
								<span class="text-slate-600 dark:text-slate-400">시간</span>
							</div>
						</div>

						<div class="space-y-2">
							<Label for="totalDays"
								>근로 일수
								<Tooltip.Root>
									<Tooltip.Trigger>
										<CircleQuestionMark class="h-4 w-4 text-gray-400 hover:text-gray-600" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>퇴근전이라면 어제까지, 퇴근 후라면 오늘까지의 근로 일수를 넣어주세요</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Label>
							<Input
								id="totalDays"
								type="number"
								placeholder="현재까지의 근로 일수"
								bind:value={totalDays}
								class="w-full"
								min="0"
							/>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button onclick={calculate} class="w-full" size="lg">계산하기</Button>
				</CardFooter>
			</Card>

			<!-- 결과 표시 카드 -->
			<Card class="w-full">
				<CardHeader>
					<CardTitle class="text-xl">계산 결과</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div class="rounded-lg border bg-slate-50 p-4 dark:bg-slate-800">
							<div class="flex items-center gap-2">
								<div class="text-sm text-slate-600 dark:text-slate-400">현재까지 총 근로 시간</div>
							</div>
							<div class="text-2xl font-bold text-slate-900 dark:text-slate-100">
								{timeToMinutes(totalHours, totalMinutes)
									? `${minutesToTime(timeToMinutes(totalHours, totalMinutes)).hours}시간 ${minutesToTime(timeToMinutes(totalHours, totalMinutes)).minutes}분`
									: '0시간 0분'}
							</div>
						</div>
						<div class="rounded-lg border bg-slate-50 p-4 dark:bg-slate-800">
							<div class="flex items-center gap-2">
								<div class="text-sm text-slate-600 dark:text-slate-400">이번달 총 근로 일수</div>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<CircleQuestionMark class="h-4 w-4 text-gray-400 hover:text-gray-600" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>이번달 총 근로시간을 8로 나눈 값입니다.</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>
							<div class="text-2xl font-bold text-slate-900 dark:text-slate-100">
								{totalWorkDays}일
							</div>
						</div>
						<div class="rounded-lg border bg-slate-50 p-4 dark:bg-slate-800">
							<div class="flex items-center gap-2">
								<div class="text-sm text-slate-600 dark:text-slate-400">적정 근로 시간</div>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<CircleQuestionMark class="h-4 w-4 text-gray-400 hover:text-gray-600" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>이번달 총 근로 일수에 8시간을 곱한 값입니다.</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>
							<div class="text-2xl font-bold text-slate-900 dark:text-slate-100">
								{minutesToTime(totalDays * 480).hours}시간 {minutesToTime(totalDays * 480)
									.minutes}분
							</div>
						</div>
						<div class="rounded-lg border bg-slate-50 p-4 dark:bg-slate-800">
							<div class="flex items-center gap-2">
								<div class="text-sm text-slate-600 dark:text-slate-400">초과 근로 시간</div>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<CircleQuestionMark class="h-4 w-4 text-gray-400 hover:text-gray-600" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>현재까지 총 근로시간에서 적정 근로시간을 뺀 시간 정보입니다.</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>
							<div
								class="text-2xl font-bold {overWorkMinutes > 0
									? 'text-red-600 dark:text-red-400'
									: 'text-green-600 dark:text-green-400'}"
							>
								{overWorkMinutes >= 0
									? `+${minutesToTime(overWorkMinutes).hours}시간 ${minutesToTime(overWorkMinutes).minutes}분`
									: `-${minutesToTime(Math.abs(overWorkMinutes)).hours}시간 ${minutesToTime(Math.abs(overWorkMinutes)).minutes}분`}
							</div>
						</div>
						<div class="rounded-lg border bg-slate-50 p-4 dark:bg-slate-800">
							<div class="flex items-center gap-2">
								<div class="text-sm text-slate-600 dark:text-slate-400">이번달 잔여 근로 일수</div>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<CircleQuestionMark class="h-4 w-4 text-gray-400 hover:text-gray-600" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>이번달 총 근로 일수에서 현재까지의 근로 일수를 뺀 값입니다.</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>
							<div class="text-2xl font-bold text-slate-900 dark:text-slate-100">
								{totalWorkDays - totalDays}일
							</div>
						</div>
						<div class="rounded-lg border bg-slate-50 p-4 dark:bg-slate-800">
							<div class="flex items-center gap-2">
								<div class="text-sm text-slate-600 dark:text-slate-400">잔여일 평균 근로 시간</div>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<CircleQuestionMark class="h-4 w-4 text-gray-400 hover:text-gray-600" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>
											초과 근로 시간을 잔여 근로 일수로 나눈 뒤, 하루 8시간에서 뺀 값입니다. <br
											/>덜 일했다면 시간이 추가되고 더 일했다면 시간이 빠집니다.
										</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>
							<div class="text-2xl font-bold text-slate-900 dark:text-slate-100">
								{remainingDayAvgTime.hours}시간 {remainingDayAvgTime.minutes}분
							</div>
							{#if remainingDayAvgTime.hours > 0 || remainingDayAvgTime.minutes > 0}
								<div class="mt-2">
									<Button
										onclick={() => {
											const params = new URLSearchParams({
												workHours: remainingDayAvgTime.hours.toString(),
												workMinutes: remainingDayAvgTime.minutes.toString()
											});
											window.location.href = `/worktime-checker/work-schedule?${params.toString()}`;
										}}
										size="sm"
										class="text-xs"
									>
										퇴근시간 계산하기<ChevronsRight />
									</Button>
								</div>
							{/if}
						</div>
					</div>

					{#if distributionInfo}
						<div
							class="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20"
						>
							<div class="mb-1 text-sm font-medium text-blue-800 dark:text-blue-200">
								📊 근로시간 분배 정보
							</div>
							<div class="text-sm text-blue-700 dark:text-blue-300">
								{distributionInfo}
							</div>
						</div>
					{/if}

					{#if overWorkMinutes > 0}
						<div
							class="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20"
						>
							<div class="text-sm text-red-800 dark:text-red-200">
								😱 허거덩거덩스 완전 많이 일하셨네요. 쉬엄쉬엄 일하세요...
							</div>
						</div>
					{:else if overWorkMinutes === 0}
						<div
							class="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20"
						>
							<div class="text-sm text-green-800 dark:text-green-200">😇 칼 같으시네요</div>
						</div>
					{:else if overWorkMinutes < 0}
						<div
							class="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20"
						>
							<div class="text-sm text-green-800 dark:text-green-200">
								🙄 어떡해... 더 일하셔야겠네요...
							</div>
						</div>
					{/if}
				</CardContent>
			</Card>
		</div>
	</div>
</Tooltip.Provider>
