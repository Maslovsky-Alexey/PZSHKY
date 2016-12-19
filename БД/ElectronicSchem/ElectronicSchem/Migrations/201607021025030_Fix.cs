namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Fix : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CommentModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Text = c.String(),
                        DateComment = c.DateTime(nullable: false),
                        Post_ID = c.Long(),
                        User_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.PostModels", t => t.Post_ID)
                .ForeignKey("dbo.AspNetUsers", t => t.User_Id)
                .Index(t => t.Post_ID)
                .Index(t => t.User_Id);
            
            CreateTable(
                "dbo.PostModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        UserID = c.String(),
                        Title = c.String(),
                        Discription = c.String(),
                        DatePost = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.ComponentModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Name = c.String(),
                        PositionX = c.String(),
                        PositionY = c.String(),
                        Url = c.String(),
                        Width = c.Int(nullable: false),
                        Height = c.Int(nullable: false),
                        Rotation = c.Int(nullable: false),
                        Post_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.PostModels", t => t.Post_ID)
                .Index(t => t.Post_ID);
            
            CreateTable(
                "dbo.InputModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        X = c.Double(nullable: false),
                        Y = c.Double(nullable: false),
                        Color = c.String(),
                        Component_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.ComponentModels", t => t.Component_ID)
                .Index(t => t.Component_ID);
            
            CreateTable(
                "dbo.PropertyModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Type = c.String(),
                        Key = c.String(),
                        Value = c.String(),
                        DefaultValue = c.String(),
                        MaxValue = c.Double(nullable: false),
                        MinValue = c.Double(nullable: false),
                        MaxLength = c.Int(nullable: false),
                        MinLength = c.Int(nullable: false),
                        Component_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.ComponentModels", t => t.Component_ID)
                .Index(t => t.Component_ID);
            
            CreateTable(
                "dbo.PropertyItemsModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Value = c.String(),
                        Property_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.PropertyModels", t => t.Property_ID)
                .Index(t => t.Property_ID);
            
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
            
            CreateTable(
                "dbo.WireModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        X1 = c.String(),
                        Y1 = c.String(),
                        X2 = c.String(),
                        Y2 = c.String(),
                        Post_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.PostModels", t => t.Post_ID)
                .Index(t => t.Post_ID);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        PhotoLink = c.String(),
                        Language = c.String(),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
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
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.LikeModels", "User_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.LikeModels", "Post_ID", "dbo.PostModels");
            DropForeignKey("dbo.LikeModels", "Comment_ID", "dbo.CommentModels");
            DropForeignKey("dbo.CommentModels", "User_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.WireModels", "Post_ID", "dbo.PostModels");
            DropForeignKey("dbo.TagModels", "Post_ID", "dbo.PostModels");
            DropForeignKey("dbo.PropertyItemsModels", "Property_ID", "dbo.PropertyModels");
            DropForeignKey("dbo.PropertyModels", "Component_ID", "dbo.ComponentModels");
            DropForeignKey("dbo.ComponentModels", "Post_ID", "dbo.PostModels");
            DropForeignKey("dbo.InputModels", "Component_ID", "dbo.ComponentModels");
            DropForeignKey("dbo.CommentModels", "Post_ID", "dbo.PostModels");
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.LikeModels", new[] { "User_Id" });
            DropIndex("dbo.LikeModels", new[] { "Post_ID" });
            DropIndex("dbo.LikeModels", new[] { "Comment_ID" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.WireModels", new[] { "Post_ID" });
            DropIndex("dbo.TagModels", new[] { "Post_ID" });
            DropIndex("dbo.PropertyItemsModels", new[] { "Property_ID" });
            DropIndex("dbo.PropertyModels", new[] { "Component_ID" });
            DropIndex("dbo.InputModels", new[] { "Component_ID" });
            DropIndex("dbo.ComponentModels", new[] { "Post_ID" });
            DropIndex("dbo.CommentModels", new[] { "User_Id" });
            DropIndex("dbo.CommentModels", new[] { "Post_ID" });
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.LikeModels");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.WireModels");
            DropTable("dbo.TagModels");
            DropTable("dbo.PropertyItemsModels");
            DropTable("dbo.PropertyModels");
            DropTable("dbo.InputModels");
            DropTable("dbo.ComponentModels");
            DropTable("dbo.PostModels");
            DropTable("dbo.CommentModels");
        }
    }
}
