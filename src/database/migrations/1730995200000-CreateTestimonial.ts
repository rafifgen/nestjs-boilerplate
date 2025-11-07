import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTestimonial1730995200000 implements MigrationInterface {
  name = 'CreateTestimonial1730995200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "testimonial" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "position" character varying NOT NULL,
        "content" text NOT NULL,
        "avatar" character varying,
        "rating" integer NOT NULL DEFAULT 5,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_e9bd6186e54a1b555e33aed8338" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "testimonial"`);
  }
}
