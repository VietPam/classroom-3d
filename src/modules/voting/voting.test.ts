/**
 * UNIT TESTS FOR VOTING MODULE
 */
import { parseVoteComment } from './votingParser';
import {
  calculatePercentages,
  calculateStudentDistribution,
  distributionToChoiceList,
  registerVote,
  createInitialVotingState,
} from './votingEngine';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('🧪 Running Voting Module Unit Tests...');

// 1. Test Parser
assert(parseVoteComment('A') === 'A', 'Single letter A');
assert(parseVoteComment('b') === 'B', 'Single letter lowercase b');
assert(parseVoteComment('1') === 'A', 'Number 1 -> A');
assert(parseVoteComment('4') === 'D', 'Number 4 -> D');
assert(parseVoteComment('đáp án C') === 'C', 'đáp án C');
assert(parseVoteComment('chọn A nha') === 'A', 'chọn A nha');
assert(parseVoteComment('câu d nhé thầy') === 'D', 'câu d nhé thầy');
assert(parseVoteComment('B nè') === 'B', 'B nè');
assert(parseVoteComment('Xin chào cả lớp') === null, 'Non-vote comment should be null');
console.log('✅ votingParser tests passed!');

// 2. Test Percentages
const p1 = calculatePercentages({ A: 10, B: 10, C: 10, D: 10 });
assert(p1.A === 25 && p1.B === 25, 'Equal 25%');

const p2 = calculatePercentages({ A: 50, B: 25, C: 25, D: 0 });
assert(p2.A === 50 && p2.B === 25 && p2.D === 0, 'Percentages calculation');
console.log('✅ calculatePercentages tests passed!');

// 3. Test Hamilton Distribution (Always sum to 20)
const d1 = calculateStudentDistribution(20, { A: 100, B: 0, C: 0, D: 0 });
assert(d1.A === 20 && d1.B === 0, '100% vote goes to A');

const d2 = calculateStudentDistribution(20, { A: 45, B: 15, C: 120, D: 20 });
const sum2 = d2.A + d2.B + d2.C + d2.D;
assert(sum2 === 20, `Sum of d2 must be 20, got ${sum2}`);
assert(d2.C >= 11, `C should have lion share >= 11, got ${d2.C}`);

const d3 = calculateStudentDistribution(20, { A: 1, B: 1, C: 1, D: 1 });
const sum3 = d3.A + d3.B + d3.C + d3.D;
assert(sum3 === 20, `Sum of d3 must be 20, got ${sum3}`);
assert(d3.A === 5 && d3.B === 5, 'Equal 5 each');
console.log('✅ calculateStudentDistribution tests passed!');

// 4. Test Choice List
const choices = distributionToChoiceList(d2, 20);
assert(choices.length === 20, `Choice list must have 20 items, got ${choices.length}`);
console.log('✅ distributionToChoiceList tests passed!');

// 5. Test Register Vote
let state = createInitialVotingState();
state = registerVote(state, {
  id: '1',
  option: 'B',
  user: 'Minh Hoàng',
  timestamp: Date.now(),
});
assert(state.totalVotes === 1, 'Total votes 1');
assert(state.voteCounts.B === 1, 'Vote count B is 1');
assert(state.recentVoters[0].user === 'Minh Hoàng', 'Recent voter recorded');
console.log('✅ registerVote tests passed!');

console.log('🎉 All Voting Module Unit Tests Passed Successfully!');
