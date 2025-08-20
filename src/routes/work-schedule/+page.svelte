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
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// 입력 변수들
	let startHour = $state('09'); // 출근 시간 (시)
	let startMinute = $state('00'); // 출근 시간 (분)
	let workHours = $state('8'); // 하루 근로 시간 (시)
	let workMinutes = $state('0'); // 하루 근로 시간 (분)
	let breakHours = $state('1'); // 휴게 시간 (시)
	let breakMinutes = $state('0'); // 휴게 시간 (분)
	let isFromCalculation = $state(false); // 계산 결과에서 온 것인지 여부

	// 계산 결과 변수들
	let endTime = $state({ hours: 0, minutes: 0 }); // 퇴근 시간
	let totalStayTime = $state({ hours: 0, minutes: 0 }); // 총 체류 시간
	let isCalculated = $state(false);

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

	// 시간을 HH:MM 형식으로 포맷
	function formatTime(hours: number, minutes: number): string {
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	}

	function calculateEndTime() {
		const startTimeMinutes = timeToMinutes(startHour, startMinute);
		const workTimeMinutes = timeToMinutes(workHours, workMinutes);
		const breakTimeMinutes = timeToMinutes(breakHours, breakMinutes);

		// 총 체류 시간 = 근로 시간 + 휴게 시간
		const totalStayMinutes = workTimeMinutes + breakTimeMinutes;
		totalStayTime = minutesToTime(totalStayMinutes);

		// 퇴근 시간 = 출근 시간 + 총 체류 시간
		const endTimeMinutes = startTimeMinutes + totalStayMinutes;
		endTime = minutesToTime(endTimeMinutes % (24 * 60)); // 24시간을 넘으면 다음날로

		isCalculated = true;
	}

	// 입력값 검증
	function validateInput() {
		// 시간 범위 검증
		if (parseInt(startHour) < 0 || parseInt(startHour) > 23) startHour = '09';
		if (parseInt(startMinute) < 0 || parseInt(startMinute) > 59) startMinute = '00';
		if (parseInt(workHours) < 0 || parseInt(workHours) > 24) workHours = '8';
		if (parseInt(workMinutes) < 0 || parseInt(workMinutes) > 59) workMinutes = '0';
		if (parseInt(breakHours) < 0 || parseInt(breakHours) > 24) breakHours = '1';
		if (parseInt(breakMinutes) < 0 || parseInt(breakMinutes) > 59) breakMinutes = '0';
	}

	// URL 파라미터에서 근로시간 가져오기
	onMount(() => {
		const urlParams = $page.url.searchParams;
		const urlWorkHours = urlParams.get('workHours');
		const urlWorkMinutes = urlParams.get('workMinutes');

		if (urlWorkHours !== null && urlWorkMinutes !== null) {
			workHours = urlWorkHours;
			workMinutes = urlWorkMinutes;
			isFromCalculation = true;
		}
	});
</script>

<Tooltip.Provider>
	<div class="flex items-center justify-center p-6">
		<div class="w-full max-w-2xl space-y-6">
			<!-- 메인 타이틀 -->
			<div class="space-y-2 text-center">
				<h1 class="text-4xl font-bold text-slate-900 dark:text-slate-100">언제 퇴근해야하지? 🤔</h1>
				<p class="text-slate-600 dark:text-slate-400">
					출근 시간과 근로 시간을 입력하면 퇴근 시간을 알려드립니다
				</p>
				{#if isFromCalculation}
					<div
						class="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20"
					>
						<div class="text-sm text-green-800 dark:text-green-200">
							🎯 잔여일 평균 근로 시간으로 자동 설정되었습니다!
						</div>
					</div>
				{/if}
			</div>

			<!-- 입력 폼 카드 -->
			<Card class="w-full">
				<CardHeader>
					<CardTitle class="text-xl">근무 시간 정보 입력</CardTitle>
				</CardHeader>
				<CardContent class="space-y-6">
					<div class="space-y-4">
						<!-- 출근 시간 -->
						<div class="space-y-2">
							<Label class="flex items-center gap-2">
								출근 시간
								<Tooltip.Root>
									<Tooltip.Trigger>
										<button
											class="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-slate-400 transition-colors hover:text-slate-600 dark:border-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
										>
											?
										</button>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>실제 출근하는 시간을 입력해주세요.</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Label>
							<div class="flex items-center gap-2">
								<Input
									type="number"
									placeholder="시"
									bind:value={startHour}
									class="flex-1"
									min="0"
									max="23"
									onblur={validateInput}
								/>
								<span class="text-slate-600 dark:text-slate-400">시</span>
								<Input
									type="number"
									placeholder="분"
									bind:value={startMinute}
									class="flex-1"
									min="0"
									max="59"
									onblur={validateInput}
								/>
								<span class="text-slate-600 dark:text-slate-400">분</span>
							</div>
						</div>

						<!-- 하루 근로 시간 -->
						<div class="space-y-2">
							<Label class="flex items-center gap-2">
								하루 근로 시간
								<Tooltip.Root>
									<Tooltip.Trigger>
										<button
											class="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-slate-400 transition-colors hover:text-slate-600 dark:border-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
										>
											?
										</button>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>실제로 일해야 하는 시간입니다. (기본 8시간)</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Label>
							<div class="flex items-center gap-2">
								<Input
									type="number"
									placeholder="시간"
									bind:value={workHours}
									class="flex-1"
									min="0"
									max="24"
									onblur={validateInput}
								/>
								<span class="text-slate-600 dark:text-slate-400">시간</span>
								<Input
									type="number"
									placeholder="분"
									bind:value={workMinutes}
									class="flex-1"
									min="0"
									max="59"
									onblur={validateInput}
								/>
								<span class="text-slate-600 dark:text-slate-400">분</span>
							</div>
						</div>

						<!-- 휴게 시간 -->
						<div class="space-y-2">
							<Label class="flex items-center gap-2">
								휴게 시간
								<Tooltip.Root>
									<Tooltip.Trigger>
										<button
											class="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-slate-400 transition-colors hover:text-slate-600 dark:border-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
										>
											?
										</button>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>점심시간 등 휴게시간입니다. (기본 1시간)</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Label>
							<div class="flex items-center gap-2">
								<Input
									type="number"
									placeholder="시간"
									bind:value={breakHours}
									class="flex-1"
									min="0"
									max="24"
									onblur={validateInput}
								/>
								<span class="text-slate-600 dark:text-slate-400">시간</span>
								<Input
									type="number"
									placeholder="분"
									bind:value={breakMinutes}
									class="flex-1"
									min="0"
									max="59"
									onblur={validateInput}
								/>
								<span class="text-slate-600 dark:text-slate-400">분</span>
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button onclick={calculateEndTime} class="w-full" size="lg">퇴근 시간 계산하기</Button>
				</CardFooter>
			</Card>

			<!-- 결과 표시 카드 -->
			{#if isCalculated}
				<Card class="w-full">
					<CardHeader>
						<CardTitle class="text-xl">계산 결과</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							<!-- 출근 시간 -->
							<div class="rounded-lg border bg-slate-50 p-4 dark:bg-slate-800">
								<div class="text-sm text-slate-600 dark:text-slate-400">출근 시간</div>
								<div class="text-2xl font-bold text-slate-900 dark:text-slate-100">
									{formatTime(parseInt(startHour), parseInt(startMinute))}
								</div>
							</div>

							<!-- 퇴근 시간 -->
							<div class="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
								<div class="text-sm text-blue-800 dark:text-blue-200">퇴근 시간</div>
								<div class="text-2xl font-bold text-blue-900 dark:text-blue-100">
									{formatTime(endTime.hours, endTime.minutes)}
								</div>
							</div>

							<!-- 총 체류 시간 -->
							<div class="rounded-lg border bg-green-50 p-4 dark:bg-green-950/20">
								<div class="flex items-center gap-2">
									<div class="text-sm text-green-800 dark:text-green-200">총 체류 시간</div>
									<Tooltip.Root>
										<Tooltip.Trigger>
											<button
												class="flex h-4 w-4 items-center justify-center rounded-full border border-green-300 text-xs font-bold text-green-400 transition-colors hover:text-green-600 dark:border-green-600 dark:text-green-500 dark:hover:text-green-300"
											>
												?
											</button>
										</Tooltip.Trigger>
										<Tooltip.Content>
											<p>근로시간 + 휴게시간 = 회사에 있는 총 시간입니다.</p>
										</Tooltip.Content>
									</Tooltip.Root>
								</div>
								<div class="text-2xl font-bold text-green-900 dark:text-green-100">
									{totalStayTime.hours}시간 {totalStayTime.minutes}분
								</div>
							</div>

							<!-- 근로 시간 -->
							<div class="rounded-lg border bg-amber-50 p-4 dark:bg-amber-950/20">
								<div class="text-sm text-amber-800 dark:text-amber-200">근로 시간</div>
								<div class="text-2xl font-bold text-amber-900 dark:text-amber-100">
									{workHours}시간 {workMinutes}분
								</div>
							</div>

							<!-- 휴게 시간 -->
							<div class="rounded-lg border bg-purple-50 p-4 dark:bg-purple-950/20">
								<div class="text-sm text-purple-800 dark:text-purple-200">휴게 시간</div>
								<div class="text-2xl font-bold text-purple-900 dark:text-purple-100">
									{breakHours}시간 {breakMinutes}분
								</div>
							</div>

							<!-- 현재 시간과 비교 -->
							<div class="rounded-lg border bg-slate-50 p-4 dark:bg-slate-800">
								<div class="text-sm text-slate-600 dark:text-slate-400">현재 시간</div>
								<div class="text-2xl font-bold text-slate-900 dark:text-slate-100">
									{new Date().toLocaleTimeString('ko-KR', {
										hour: '2-digit',
										minute: '2-digit',
										hour12: false
									})}
								</div>
							</div>
						</div>

						<!-- 안내 메시지 -->
						<div class="mt-6">
							{#if new Date().getHours() * 60 + new Date().getMinutes() < endTime.hours * 60 + endTime.minutes}
								<div
									class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20"
								>
									<div class="text-sm text-blue-800 dark:text-blue-200">
										🏃‍♂️ 아직 퇴근 시간이 되지 않았습니다! 조금만 더 화이팅하세요!
									</div>
								</div>
							{:else}
								<div
									class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20"
								>
									<div class="text-sm text-green-800 dark:text-green-200">
										🎉 퇴근 시간이 지났습니다! 수고하셨어요!
									</div>
								</div>
							{/if}
						</div>
					</CardContent>
				</Card>
			{/if}
		</div>
	</div>
</Tooltip.Provider>
