-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT,
    "releaseDate" TIMESTAMP(3),
    "length" INTEGER NOT NULL,
    "makerId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coverUrlKey" TEXT NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VideoTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonAlias" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,

    CONSTRAINT "PersonAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoMaker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoMaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoLabel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "originalPath" TEXT,
    "uploadedPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VideoToVideoTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_VideosDirected" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_VideosStarred" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_code_key" ON "Video"("code");

-- CreateIndex
CREATE UNIQUE INDEX "VideoTag_name_key" ON "VideoTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PersonAlias_alias_key" ON "PersonAlias"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "VideoMaker_name_key" ON "VideoMaker"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VideoLabel_name_key" ON "VideoLabel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_VideoToVideoTag_AB_unique" ON "_VideoToVideoTag"("A", "B");

-- CreateIndex
CREATE INDEX "_VideoToVideoTag_B_index" ON "_VideoToVideoTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VideosDirected_AB_unique" ON "_VideosDirected"("A", "B");

-- CreateIndex
CREATE INDEX "_VideosDirected_B_index" ON "_VideosDirected"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VideosStarred_AB_unique" ON "_VideosStarred"("A", "B");

-- CreateIndex
CREATE INDEX "_VideosStarred_B_index" ON "_VideosStarred"("B");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_makerId_fkey" FOREIGN KEY ("makerId") REFERENCES "VideoMaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "VideoLabel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonAlias" ADD CONSTRAINT "PersonAlias_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoToVideoTag" ADD CONSTRAINT "_VideoToVideoTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoToVideoTag" ADD CONSTRAINT "_VideoToVideoTag_B_fkey" FOREIGN KEY ("B") REFERENCES "VideoTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideosDirected" ADD CONSTRAINT "_VideosDirected_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideosDirected" ADD CONSTRAINT "_VideosDirected_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideosStarred" ADD CONSTRAINT "_VideosStarred_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideosStarred" ADD CONSTRAINT "_VideosStarred_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
