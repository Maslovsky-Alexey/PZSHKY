namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class GlobalUpdate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CommentModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Text = c.String(),
                        CountLike = c.Long(nullable: false),
                        CountDisLike = c.Long(nullable: false),
                        DateComment = c.DateTime(nullable: false),
                        User_Id = c.String(maxLength: 128),
                        PostModel_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.AspNetUsers", t => t.User_Id)
                .ForeignKey("dbo.PostModels", t => t.PostModel_ID)
                .Index(t => t.User_Id)
                .Index(t => t.PostModel_ID);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        PhotoLink = c.String(),
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
                        PostModel_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.PostModels", t => t.PostModel_ID)
                .Index(t => t.PostModel_ID);
            
            CreateTable(
                "dbo.InputModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        X = c.Int(nullable: false),
                        Y = c.Int(nullable: false),
                        Color = c.String(),
                        ComponentModel_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.ComponentModels", t => t.ComponentModel_ID)
                .Index(t => t.ComponentModel_ID);
            
            CreateTable(
                "dbo.PropertyModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Type = c.String(),
                        Key = c.String(),
                        DefaultValue = c.String(),
                        MaxValue = c.Double(nullable: false),
                        MinValue = c.Double(nullable: false),
                        MaxLength = c.Int(nullable: false),
                        MinLength = c.Int(nullable: false),
                        ComponentModel_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.ComponentModels", t => t.ComponentModel_ID)
                .Index(t => t.ComponentModel_ID);
            
            CreateTable(
                "dbo.PropertyItemsModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Value = c.String(),
                        PropertyModel_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.PropertyModels", t => t.PropertyModel_ID)
                .Index(t => t.PropertyModel_ID);
            
            CreateTable(
                "dbo.PostModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        UserID = c.String(),
                        Title = c.String(),
                        Discription = c.String(),
                        CountLike = c.Long(nullable: false),
                        CountDisLike = c.Long(nullable: false),
                        DatePost = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.WireModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        X1 = c.String(),
                        Y1 = c.String(),
                        X2 = c.String(),
                        Y2 = c.String(),
                        PostModel_ID = c.Long(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.PostModels", t => t.PostModel_ID)
                .Index(t => t.PostModel_ID);
            
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
            DropForeignKey("dbo.WireModels", "PostModel_ID", "dbo.PostModels");
            DropForeignKey("dbo.ComponentModels", "PostModel_ID", "dbo.PostModels");
            DropForeignKey("dbo.CommentModels", "PostModel_ID", "dbo.PostModels");
            DropForeignKey("dbo.PropertyModels", "ComponentModel_ID", "dbo.ComponentModels");
            DropForeignKey("dbo.PropertyItemsModels", "PropertyModel_ID", "dbo.PropertyModels");
            DropForeignKey("dbo.InputModels", "ComponentModel_ID", "dbo.ComponentModels");
            DropForeignKey("dbo.CommentModels", "User_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.WireModels", new[] { "PostModel_ID" });
            DropIndex("dbo.PropertyItemsModels", new[] { "PropertyModel_ID" });
            DropIndex("dbo.PropertyModels", new[] { "ComponentModel_ID" });
            DropIndex("dbo.InputModels", new[] { "ComponentModel_ID" });
            DropIndex("dbo.ComponentModels", new[] { "PostModel_ID" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.CommentModels", new[] { "PostModel_ID" });
            DropIndex("dbo.CommentModels", new[] { "User_Id" });
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.WireModels");
            DropTable("dbo.PostModels");
            DropTable("dbo.PropertyItemsModels");
            DropTable("dbo.PropertyModels");
            DropTable("dbo.InputModels");
            DropTable("dbo.ComponentModels");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.CommentModels");
        }
    }
}
