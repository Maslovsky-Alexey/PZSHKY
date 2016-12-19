namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Likes : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.LikeModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        isLike = c.Boolean(nullable: false),
                        Comment_ID = c.Long(),
                        Post_ID = c.Long(),
                        User_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.CommentModels", t => t.Comment_ID)
                .ForeignKey("dbo.PostModels", t => t.Post_ID)
                .ForeignKey("dbo.AspNetUsers", t => t.User_Id)
                .Index(t => t.Comment_ID)
                .Index(t => t.Post_ID)
                .Index(t => t.User_Id);
            
            DropColumn("dbo.CommentModels", "CountLike");
            DropColumn("dbo.CommentModels", "CountDisLike");
            DropColumn("dbo.PostModels", "CountLike");
            DropColumn("dbo.PostModels", "CountDisLike");
        }
        
        public override void Down()
        {
            AddColumn("dbo.PostModels", "CountDisLike", c => c.Long(nullable: false));
            AddColumn("dbo.PostModels", "CountLike", c => c.Long(nullable: false));
            AddColumn("dbo.CommentModels", "CountDisLike", c => c.Long(nullable: false));
            AddColumn("dbo.CommentModels", "CountLike", c => c.Long(nullable: false));
            DropForeignKey("dbo.LikeModels", "User_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.LikeModels", "Post_ID", "dbo.PostModels");
            DropForeignKey("dbo.LikeModels", "Comment_ID", "dbo.CommentModels");
            DropIndex("dbo.LikeModels", new[] { "User_Id" });
            DropIndex("dbo.LikeModels", new[] { "Post_ID" });
            DropIndex("dbo.LikeModels", new[] { "Comment_ID" });
            DropTable("dbo.LikeModels");
        }
    }
}
