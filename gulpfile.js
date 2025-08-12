const dotenv = require('dotenv');

dotenv.config();

const { exec } = require('child_process');

const gulp = require('gulp');
const argv = require('minimist');

gulp.task('generate:migration', function (done) {
  const args = argv(process.argv.slice(2));
  const { name } = args;
  const dbUrl = process.env.DATABASE_URL;

  exec(
    `SQL_URL=${dbUrl} npm run typeorm -- -d ./typeorm.config.ts migration:generate ./src/shared/db/typeorm/migrations/${name}`,
    (err, stdout, stderr) => {
      if (stderr) throw new Error(stderr);

      return done(err);
    },
  );
});

gulp.task('create:migration', function (done) {
  const args = argv(process.argv.slice(2));

  const { name } = args;
  const dbUrl = process.env.DATABASE_URL;
  exec(
    `SQL_URL=${dbUrl} npm run typeorm -- -d ./typeorm.config.ts migration:create ./src/shared/db/typeorm/migrations/${name}`,
    (err, stdout, stderr) => {
      if (stderr) throw new Error(stderr);

      return done(err);
    },
  );
});

gulp.task('revert:migration', function (done) {
  const dbUrl = process.env.DATABASE_URL;

  exec(
    `SQL_URL=${dbUrl} npm run typeorm -- -d ./typeorm.config.ts migration:revert`,
    (err, stdout, stderr) => {
      if (stderr) throw new Error(stderr);

      return done(err);
    },
  );
});

gulp.task('run:migration', function (done) {
  const dbUrl = process.env.DATABASE_URL;

  console.log('dbUrl', dbUrl);

  exec(
    `SQL_URL=${dbUrl} npm run typeorm -- -d ./typeorm.config.ts migration:run`,
    (err, stdout, stderr) => {
      if (stderr) throw new Error(stderr);

      return done(err);
    },
  );
});
