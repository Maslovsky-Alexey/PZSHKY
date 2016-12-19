namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedTags : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.TagModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Value = c.String(),
                        Post_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.PostModels", t => t.Post_ID)
                .Index(t => t.Post_ID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TagModels", "Post_ID", "dbo.PostModels");
            DropIndex("dbo.TagModels", new[] { "Post_ID" });
            DropTable("dbo.TagModels");
        }
    }
}
