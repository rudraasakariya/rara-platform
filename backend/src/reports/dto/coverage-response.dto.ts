import { ApiProperty } from '@nestjs/swagger';

export class SkillCoverageItemDto {
  @ApiProperty({ description: 'Skill UUID' })
  skillId: string;

  @ApiProperty({ description: 'Skill code' })
  skillCode: string;

  @ApiProperty({ description: 'Skill label' })
  skillLabel: string;

  @ApiProperty({ description: 'Cluster UUID' })
  clusterId: string;

  @ApiProperty({ description: 'Cluster label' })
  clusterLabel: string;

  @ApiProperty({ description: 'Domain UUID' })
  domainId: string;

  @ApiProperty({ description: 'Domain label' })
  domainLabel: string;

  @ApiProperty({ description: 'Whether this skill was covered in at least one session' })
  covered: boolean;

  @ApiProperty({ description: 'Number of sessions covering this skill' })
  sessionCount: number;
}

export class CoverageResponseDto {
  @ApiProperty({ description: 'Total number of skills in the selected scope' })
  totalSkills: number;

  @ApiProperty({ description: 'Number of distinct skills covered' })
  coveredSkills: number;

  @ApiProperty({ description: 'Coverage percentage (0–100)' })
  coveragePercent: number;

  @ApiProperty({ type: [SkillCoverageItemDto], description: 'Per-skill breakdown' })
  skills: SkillCoverageItemDto[];
}
